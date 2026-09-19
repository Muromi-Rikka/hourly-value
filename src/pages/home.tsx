import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Beef,
  Car,
  DollarSign,
  ShoppingBasket,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sortedByValuation } from "@/data/bigmac";
import { sortedByHours as sortedByCommodityHours } from "@/data/commodity-index";
import { sortedByHours as sortedByIphoneHours } from "@/data/iphone-index";
import { sortedByDays } from "@/data/modely-index";
import { sortedByWage, wages } from "@/data/wages";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Beef,
  Car,
  DollarSign,
  ShoppingBasket,
  Smartphone,
};

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
      <section className="pb-10 pt-6 sm:pb-14 sm:pt-8">
        <h1 className="animate-fade-up max-w-3xl font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em]">
          全球购买力对比
        </h1>
        <p className="animate-fade-up delay-100 mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          从最低工资到日常消费品，以人民币为统一基准，直观展示全球购买力差异。覆盖 5 大指数，涵盖多个经济体。
        </p>
      </section>

      {/* Index cards */}
      <section className="animate-fade-up delay-200">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = ICONS[stat.icon];
            return (
              <Card className="flex flex-col" key={stat.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-5 w-5 text-muted-foreground" />
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
                          <span className="font-display text-lg">{metric.value}</span>
                          {metric.detail
                            ? <span className="text-xs text-muted-foreground">{metric.detail}</span>
                            : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="group" size="sm" variant="ghost">
                    <Link to={stat.link}>
                      {stat.linkLabel}
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Highlights */}
      <section className="mt-10 sm:mt-12">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">数据亮点</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border p-5">
            <p className="font-display text-3xl leading-none tracking-tight">
              {highlights.countryCount}
              <span className="ml-1 text-sm text-muted-foreground">国家/地区</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {highlights.regionCount}
              {" 个区域 · 5 大指数"}
            </p>
          </div>
          {highlights.topCountry[1] >= 3
            ? (
                <div className="rounded-xl border p-5">
                  <p className="font-display text-3xl leading-none tracking-tight">
                    {highlights.topCountry[0]}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    在
                    {highlights.topCountry[1]}
                    {" 个指数中排名前三"}
                  </p>
                </div>
              )
            : (
                <div className="rounded-xl border p-5">
                  <p className="font-display text-3xl leading-none tracking-tight">5 大指数</p>
                  <p className="mt-2 text-sm text-muted-foreground">从工资到消费品，多维对比</p>
                </div>
              )}
          <div className="rounded-xl border p-5">
            <p className="font-display text-3xl leading-none tracking-tight">
              {highlights.maxGap.ratio.toFixed(1)}
              <span className="text-[0.4em] text-muted-foreground">×</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {highlights.maxGap.index}
              {" 指数最大差距"}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 pb-4 sm:mt-16">
        <Button asChild className="animate-fade-up delay-300 group" size="lg">
          <Link to="/explore">
            探索最低工资数据
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </section>
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
  const topCountry = freq.keys().reduce(
    (best, key) => {
      const count = freq.get(key)!;
      return count > best[1] ? [key, count] : best;
    },
    ["", 0] as [string, number],
  );

  const ratios: Array<{ index: string; ratio: number }> = [
    {
      index: "最低工资",
      ratio: sortedByWage[0].cnyEquivalent / sortedByWage[sortedByWage.length - 1].cnyEquivalent,
    },
    {
      index: "iPhone",
      ratio: sortedByIphoneHours[sortedByIphoneHours.length - 1].hoursToBuy / sortedByIphoneHours[0].hoursToBuy,
    },
    {
      index: "物资",
      ratio: sortedByCommodityHours[sortedByCommodityHours.length - 1].hoursToBuy / sortedByCommodityHours[0].hoursToBuy,
    },
    {
      index: "Model Y",
      ratio: sortedByDays[sortedByDays.length - 1].daysToBuy! / sortedByDays[0].daysToBuy!,
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
      linkLabel: "查看工资数据 →",
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
      linkLabel: "查看 iPhone 指数 →",
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
      linkLabel: "查看巨无霸指数 →",
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
      linkLabel: "查看物资指数 →",
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
      linkLabel: "查看 Model Y 指数 →",
      metrics: [
        { detail: modelyCheapest.country, label: "最少", value: `${modelyCheapest.daysToBuy}天` },
        { detail: modelyMost.country, label: "最多", value: `${modelyMost.daysToBuy}天` },
      ],
      title: "Model Y 指数",
    },
  ];
}
