import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Beef,
  Car,
  DollarSign,
  ShoppingBasket,
  Smartphone,
} from "lucide-react";

import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard/SpotlightCard";
import { RegionLegend } from "@/components/region-legend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sortedByValuation } from "@/data/bigmac";
import { sortedByHours as sortedByCommodityHours } from "@/data/commodity-index";
import { sortedByHours as sortedByIphoneHours } from "@/data/iphone-index";
import { sortedByDays } from "@/data/modely-index";
import { sortedByWage, wages } from "@/data/wages";
import { regionColor } from "@/lib/region";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Beef,
  Car,
  DollarSign,
  ShoppingBasket,
  Smartphone,
};

// 比值保留 1 位小数，避免浮点长尾被 CountUp 展开成一串小数
const round1 = (value: number) => Number(value.toFixed(1));

interface IndexStat {
  description: string;
  icon: string;
  id: string;
  link: string;
  linkLabel: string;
  metrics: Array<{ detail?: string; label: string; value: string }>;
  title: string;
}

export function Home() {
  const stats = getIndexStats();
  const highlights = getHighlights();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pb-10 pt-6 sm:pb-14 sm:pt-8">
        <div className="rule-top mb-6" />
        <SplitText
          className="max-w-3xl font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em]"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          tag="h1"
          text="全球购买力对比"
        />
        <AnimatedContent delay={0.15} distance={30} duration={0.6}>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            从最低工资到日常消费品，以人民币为统一基准，直观展示全球购买力差异。覆盖 5 大指数，涵盖多个经济体。
          </p>
          <div className="mt-4 border-t border-border/50 w-16" />
        </AnimatedContent>

        {/* 刻度尺 — global wage spread as a ruler */}
        <AnimatedContent delay={0.25} distance={20} duration={0.6}>
          <WageRuler />
        </AnimatedContent>
      </section>

      {/* Index cards */}
      <AnimatedContent delay={0.1} distance={60} duration={0.8} threshold={0.15}>
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = ICONS[stat.icon];
              return (
                <SpotlightCard key={stat.id} spotlightColor="rgba(14, 107, 92, 0.12)">
                  <Card className="flex flex-col border-0 bg-transparent shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-display">
                        <span className="rounded-full bg-primary/10 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </span>
                        {stat.title}
                      </CardTitle>
                      <CardDescription>{stat.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-3">
                        {stat.metrics.map(metric => (
                          <div className="flex items-baseline justify-between" key={metric.label}>
                            <span className="text-sm text-muted-foreground">{metric.label}</span>
                            <div className="flex items-baseline gap-2">
                              <span className="stat-number text-lg">{metric.value}</span>
                              {metric.detail
                                ? <span className="text-xs text-muted-foreground">{metric.detail}</span>
                                : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-border/30 mt-auto pt-4">
                      <Link className="group" to={stat.link}>
                        <Button size="sm" variant="ghost">
                          {stat.linkLabel}
                          <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </SpotlightCard>
              );
            })}
          </div>
        </section>
      </AnimatedContent>

      {/* Highlights */}
      <AnimatedContent delay={0.15} distance={40} duration={0.6} threshold={0.1}>
        <section className="mt-10 sm:mt-12">
          <p className="mb-4 text-xs font-medium tracking-wider text-muted-foreground">数据亮点</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card p-5">
              <p className="stat-number text-4xl leading-none tracking-tight">
                <CountUp duration={1.5} to={highlights.countryCount} />
                <span className="ml-1 text-sm text-muted-foreground">国家/地区</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {highlights.regionCount}
                {" 个区域 · 5 大指数"}
              </p>
            </div>
            {highlights.topCountry[1] >= 3
              ? (
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="stat-number text-4xl leading-none tracking-tight">
                      {highlights.topCountry[0]}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      在
                      <CountUp duration={1} to={highlights.topCountry[1]} />
                      {" 个指数中排名前三"}
                    </p>
                  </div>
                )
              : (
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="stat-number text-4xl leading-none tracking-tight">5 大指数</p>
                    <p className="mt-2 text-sm text-muted-foreground">从工资到消费品，多维对比</p>
                  </div>
                )}
            <div className="rounded-2xl border bg-card p-5">
              <p className="stat-number text-4xl leading-none tracking-tight">
                <CountUp duration={2} to={highlights.maxGap.ratio} />
                <span className="text-[0.4em] text-muted-foreground">×</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {highlights.maxGap.index}
                {" 指数最大差距"}
              </p>
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* CTA */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="mt-12 pb-4 sm:mt-16">
          <Link className="group" to="/explore">
            <Button className="rounded-full shadow-lg shadow-primary/20" size="lg">
              探索最低工资数据
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </section>
      </AnimatedContent>
    </div>
  );
}

function getHighlights() {
  const countryCount = new Set(wages.map(w => w.countryCode)).size;
  const regionCount = new Set(wages.map(w => w.region)).size;

  const freq = new Map<string, number>();
  for (const array of [sortedByWage.slice(0, 3), sortedByIphoneHours.slice(0, 3), sortedByValuation.slice(0, 3), sortedByCommodityHours.slice(0, 3), sortedByDays.slice(0, 3)]) {
    for (const item of array) {
      freq.set(item.country, (freq.get(item.country) ?? 0) + 1);
    }
  }
  const topCountry = freq.keys().reduce<[string, number]>(
    (best, key) => {
      const count = freq.get(key) ?? 0;
      return count > best[1] ? [key, count] : best;
    },
    ["", 0],
  );

  const iphoneHours = sortedByIphoneHours.map(entry => entry.hoursToBuy).filter((hours): hours is number => hours !== null);
  const commodityHours = sortedByCommodityHours.map(entry => entry.hoursToBuy).filter((hours): hours is number => hours !== null);
  const modelyDays = sortedByDays.map(entry => entry.daysToBuy).filter((days): days is number => days !== null);

  const ratios: Array<{ index: string; ratio: number }> = [
    {
      index: "最低工资",
      ratio: round1(sortedByWage[0].cnyEquivalent / sortedByWage[sortedByWage.length - 1].cnyEquivalent),
    },
    {
      index: "iPhone",
      ratio: round1(iphoneHours[iphoneHours.length - 1] / iphoneHours[0]),
    },
    {
      index: "物资",
      ratio: round1(commodityHours[commodityHours.length - 1] / commodityHours[0]),
    },
    {
      index: "Model Y",
      ratio: round1(modelyDays[modelyDays.length - 1] / modelyDays[0]),
    },
  ];
  const maxGap = ratios.toSorted((a, b) => b.ratio - a.ratio)[0];

  return { countryCount, maxGap, regionCount, topCountry };
}

function getIndexStats(): IndexStat[] {
  const wageHigh = sortedByWage[0];
  const wageLow = sortedByWage[sortedByWage.length - 1];

  const iphoneCheapest = sortedByIphoneHours[0];
  const iphoneMost = sortedByIphoneHours[sortedByIphoneHours.length - 1];

  const over = sortedByValuation[0];
  const under = sortedByValuation[sortedByValuation.length - 1];

  const commodityCheapest = sortedByCommodityHours[0];
  const commodityMost = sortedByCommodityHours[sortedByCommodityHours.length - 1];

  const modelyCheapest = sortedByDays[0];
  const modelyMost = sortedByDays[sortedByDays.length - 1];

  return [
    {
      description: "以人民币折算的全球法定时薪",
      icon: "DollarSign",
      id: "wages",
      link: "/explore",
      linkLabel: "查看工资数据",
      metrics: [
        { detail: wageHigh.country, label: "最高", value: `¥${wageHigh.cnyEquivalent}/h` },
        { detail: wageLow.country, label: "最低", value: `¥${wageLow.cnyEquivalent}/h` },
      ],
      title: "最低工资",
    },
    {
      description: "购买一部 iPhone 18 Pro 所需工时",
      icon: "Smartphone",
      id: "iphone",
      link: "/iphone",
      linkLabel: "查看 iPhone 指数",
      metrics: [
        { detail: iphoneCheapest.country, label: "最少", value: `${iphoneCheapest.hoursToBuy}h` },
        { detail: iphoneMost.country, label: "最多", value: `${iphoneMost.hoursToBuy}h` },
      ],
      title: "iPhone 指数",
    },
    {
      description: "货币相对美元的购买力估值",
      icon: "Beef",
      id: "bigmac",
      link: "/bigmac",
      linkLabel: "查看巨无霸指数",
      metrics: [
        { detail: over.country, label: "最高估", value: `${over.valuationPct}%` },
        { detail: under.country, label: "最低估", value: `${under.valuationPct}%` },
      ],
      title: "巨无霸指数",
    },
    {
      description: "购买基础生活物资篮所需工时",
      icon: "ShoppingBasket",
      id: "commodity",
      link: "/commodity",
      linkLabel: "查看物资指数",
      metrics: [
        { detail: commodityCheapest.country, label: "最少", value: `${commodityCheapest.hoursToBuy}h` },
        { detail: commodityMost.country, label: "最多", value: `${commodityMost.hoursToBuy}h` },
      ],
      title: "物资指数",
    },
    {
      description: "购买一辆 Tesla Model Y 所需天数",
      icon: "Car",
      id: "modely",
      link: "/modely",
      linkLabel: "查看 Model Y 指数",
      metrics: [
        { detail: modelyCheapest.country, label: "最少", value: `${modelyCheapest.daysToBuy}天` },
        { detail: modelyMost.country, label: "最多", value: `${modelyMost.daysToBuy}天` },
      ],
      title: "Model Y 指数",
    },
  ];
}

/**
 * 首页「刻度尺」：13 国最低时薪按比例落在同一把尺上，
 * 刻度线在下、国家点在上，点色即区域色。
 */
function WageRuler() {
  const values = wages.map(entry => entry.cnyEquivalent);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const positionOf = (value: number) => (span === 0 ? 50 : ((value - min) / span) * 100);
  const lowest = sortedByWage[sortedByWage.length - 1];
  const highest = sortedByWage[0];
  const ticks = Array.from({ length: 21 }, (_, index) => index);

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
        <span>
          最低
          {" "}
          {lowest.country}
        </span>
        <span className="hidden sm:inline">人民币/小时</span>
        <span>
          {highest.country}
          {" "}
          最高
        </span>
      </div>

      <div
        aria-label={`全球最低时薪刻度尺：${lowest.country} ¥${min} 至 ${highest.country} ¥${max} 每小时，共 ${wages.length} 个国家/地区`}
        className="relative mt-2 h-9"
        role="img"
      >
        {/* 栏线基座 */}
        <div className="absolute inset-x-0 bottom-7 h-px bg-border" />
        {/* 刻度：每 5% 一格，每 25% 为主刻度 */}
        {ticks.map(tick => (
          <span
            className={tick % 5 === 0
              ? "absolute bottom-3 h-4 w-px bg-border"
              : "absolute bottom-5 h-2 w-px bg-border"}
            key={tick}
            style={{ left: `${tick * 5}%` }}
          />
        ))}
        {/* 主刻度的人民币标值 */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const edge = percent === 0 ? "" : (percent === 100 ? "-translate-x-full" : "-translate-x-1/2");
          return (
            <span
              className={`absolute bottom-0 text-[10px] tabular-nums text-muted-foreground ${edge}`}
              key={percent}
              style={{ left: `${percent}%` }}
            >
              ¥
              {Math.round(min + span * percent / 100)}
            </span>
          );
        })}
        {/* 国家点：落在各自的时薪位置上 */}
        {wages.map(entry => (
          <span
            className="absolute bottom-7 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background"
            key={entry.countryCode}
            style={{ background: regionColor(entry.region), left: `${positionOf(entry.cnyEquivalent)}%` }}
            title={`${entry.country} · ¥${entry.cnyEquivalent}/小时`}
          />
        ))}
      </div>

      <RegionLegend />
    </div>
  );
}
