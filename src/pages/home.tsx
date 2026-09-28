import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Beef,
  Car,
  DollarSign,
  ShoppingBasket,
  Smartphone,
} from "lucide-react";
import * as React from "react";

import type { HourlyPowerEntry } from "@/data/hourly-power";

import { CountryFlag } from "@/components/country-flag";
import { CountrySelect } from "@/components/country-select";
import { CoverageBadge } from "@/components/coverage-badge";
import { HourlyCompare } from "@/components/hourly-compare";
import { HourlyWallet } from "@/components/hourly-wallet";
import { FeaturedMethodNotes } from "@/components/method-notes";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { RegionLegend } from "@/components/region-legend";
import { SectionHeading } from "@/components/section-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants } from "@/components/ui/card";
import { hourlyPower, hourlyPowerOf } from "@/data/hourly-power";
import { SCOPE_CHIPS } from "@/data/methodology";
import { cnyHour, DASH, ratio as formatRatio, hourNumber, round1 } from "@/lib/format";
import { regionColor } from "@/lib/region";
import { cn } from "@/lib/utilities";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Beef,
  Car,
  DollarSign,
  ShoppingBasket,
  Smartphone,
};

const DEFAULT_A = "CN";
const DEFAULT_B = "DE";

interface IndexStat {
  coverage: number;
  description: string;
  group: string;
  icon: string;
  id: string;
  link: string;
  linkLabel: string;
  metrics: Array<{ country: string; countryCode: string; label: string; value: string }>;
  title: string;
}

export function Home() {
  const stats = React.useMemo(() => getIndexStats(), []);
  const highlights = React.useMemo(() => getHighlights(), []);

  const [walletCode, setWalletCode] = React.useState(DEFAULT_A);
  const [aCode, setACode] = React.useState(DEFAULT_A);
  const [bCode, setBCode] = React.useState(DEFAULT_B);
  const wallet = hourlyPowerOf(walletCode) ?? hourlyPower[0];
  const a = hourlyPowerOf(aCode) ?? hourlyPowerOf(DEFAULT_A)!;
  const b = hourlyPowerOf(bCode) ?? hourlyPowerOf(DEFAULT_B)!;

  return (
    <div>
      {/* 1 — 首屏问题 */}
      <section className="hero overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="rule-top mb-6" />
        <SplitText
          className="hero-title max-w-4xl"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          tag="h1"
          text="同样工作 1 小时，各国能买到什么？"
        />
        <AnimatedContent delay={0.15} distance={30} duration={0.6}>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            以各国法定最低时薪为共同起点，把工资、巨无霸、基础物资、iPhone 和 Model Y
            拉到同一把尺子上。已收录
            {" "}
            {hourlyPower.length}
            {" 个国家/地区。"}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {SCOPE_CHIPS.map(chip => (
              <span className="rounded-full border bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground" key={chip}>
                {chip}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link className={cn(buttonVariants({ size: "lg" }), "group")} to="/hourly">
              选择两个国家比较
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link className={buttonVariants({ size: "lg", variant: "outline" })} to="/about">
              先看口径说明
            </Link>
          </div>
        </AnimatedContent>
      </section>

      {/* 2 — 一个核心数字：一小时钱包 */}
      <AnimatedContent delay={0.1} distance={40} duration={0.6}>
        <HourlyWallet entry={wallet}>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,20rem)_1fr] sm:items-end">
            <CountrySelect
              id="home-wallet-country"
              label="选择国家"
              onChange={setWalletCode}
              options={hourlyPower}
              value={wallet.countryCode}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              一小时的最低工资 =
              {" "}
              {wallet.bigMacPerHour === null ? DASH : `${wallet.bigMacPerHour} 个巨无霸`}
              {" · "}
              {wallet.basketHours === null
                ? "物资篮无数据"
                : `基础物资篮需工作 ${hourNumber(wallet.basketHours)} 小时`}
              {" · "}
              {wallet.modelyHours === null
                ? "Model Y 无数据"
                : `Model Y 需工作 ${hourNumber(wallet.modelyHours)} 小时`}
            </p>
          </div>
        </HourlyWallet>
      </AnimatedContent>

      {/* 3 — 一小时对一小时 */}
      <AnimatedContent delay={0.1} distance={40} duration={0.6} threshold={0.1}>
        <section className="section">
          <SectionHeading
            action={(
              <Link className="group inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2" to="/hourly">
                完整对比页
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
            eyebrow="一小时对一小时"
            title="同样一小时，谁更宽裕"
          />
          <HourlyCompare
            a={a}
            b={b}
            compact
            onChange={(side, code) => (side === "a" ? setACode(code) : setBCode(code))}
            onSwap={() => {
              setACode(b.countryCode);
              setBCode(a.countryCode);
            }}
            options={hourlyPower}
          />
        </section>
      </AnimatedContent>

      {/* 4 — 日常与耐用品分层 */}
      <AnimatedContent delay={0.1} distance={60} duration={0.8} threshold={0.15}>
        <section className="section">
          <SectionHeading
            description="日常饮食、随身物品、大件耐用品的压力完全不同，分开看才不会互相抵消。"
            eyebrow="五项指标"
            title="从一顿饭到一辆车"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = ICONS[stat.icon];
              return (
                <Link
                  className={cn(cardVariants({ variant: "default" }), "group card-interactive flex flex-col")}
                  key={stat.id}
                  to={stat.link}
                >
                  <CardHeader className="space-y-3 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <p className="eyebrow pt-1 text-right">{stat.group}</p>
                    </div>
                    <div>
                      <CardTitle className="font-display text-lg leading-snug">{stat.title}</CardTitle>
                      <CardDescription className="mt-1.5">{stat.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    <div className="divide-y divide-border/70 border-t border-border/70">
                      {stat.metrics.map(metric => (
                        <div className="flex items-baseline justify-between gap-3 px-5 py-3 sm:px-6" key={metric.label}>
                          <span className="text-xs text-muted-foreground">{metric.label}</span>
                          <span className="flex items-baseline gap-2">
                            <span className="stat-number text-xl">{metric.value}</span>
                            <span className="flex w-[4.5rem] shrink-0 items-center gap-1 text-xs text-muted-foreground">
                              <CountryFlag className="h-4 w-4 shrink-0" countryCode={metric.countryCode} />
                              <span className="truncate">{metric.country}</span>
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto border-t border-border/70 p-5 pt-3 sm:p-6">
                    <div className="flex w-full items-center justify-between gap-3">
                      <CoverageBadge coverage={stat.coverage} />
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {stat.linkLabel}
                        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </CardFooter>
                </Link>
              );
            })}
          </div>
        </section>
      </AnimatedContent>

      {/* 5 — 排行刻度尺 */}
      <AnimatedContent delay={0.15} distance={40} duration={0.6} threshold={0.1}>
        <section className="section">
          <WageRuler />
        </section>
      </AnimatedContent>

      {/* 数据亮点 */}
      <AnimatedContent delay={0.15} distance={40} duration={0.6} threshold={0.1}>
        <section className="section">
          <p className="eyebrow mb-4">数据亮点</p>
          <div className={cn(cardVariants({ variant: "inverse" }), "grid overflow-hidden sm:grid-cols-3")}>
            <div className="border-b border-background/15 p-5 sm:border-b-0 sm:border-r sm:p-6">
              <p className="stat-number stat-lg">
                <CountUp duration={1.5} to={highlights.countryCount} />
                <span className="ml-1.5 font-sans text-sm text-background/70">国家/地区</span>
              </p>
              <p className="mt-2 text-sm text-background/70">
                {highlights.regionCount}
                {" 个区域 · 5 项指标"}
              </p>
            </div>
            <div className="border-b border-background/15 p-5 sm:border-b-0 sm:border-r sm:p-6">
              <p className="flex items-center gap-3 font-display stat-lg">
                <CountryFlag className="h-10 w-10 shrink-0" countryCode={highlights.topCountry.countryCode} />
                {highlights.topCountry.country}
              </p>
              <p className="mt-2 text-sm text-background/70">
                在
                <CountUp duration={1} to={highlights.topCountry.count} />
                {" 项消费指标中排名前三"}
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="stat-number stat-lg">
                <CountUp duration={2} to={highlights.maxGap.ratio} />
                <span className="ml-0.5 font-sans text-[0.4em] text-background/60">×</span>
              </p>
              <p className="mt-2 text-sm text-background/70">
                {highlights.maxGap.label}
                {" 指标的首尾差距"}
              </p>
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* 6 — 三分钟读懂口径 */}
      <FeaturedMethodNotes />

      {/* 7 — 进入完整探索 */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="section pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link className={cn(buttonVariants({ size: "lg" }), "group")} to="/hourly">
              进入一小时购买力
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary" to="/explore">
              只看最低工资数据
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>
      </AnimatedContent>
    </div>
  );
}

/**
 * 数据亮点：跨越四项消费指标统计"排进前三"的次数，
 * 以及各项指标的首尾差距。不合成任何总分。
 */
function getHighlights() {
  const countryCount = hourlyPower.length;
  const regionCount = new Set(hourlyPower.map(entry => entry.region)).size;

  const rankings: HourlyPowerEntry[][] = [
    hourlyPower.toSorted((a, b) => b.cnyHour - a.cnyHour),
    hourlyPower.filter(entry => entry.bigMacPerHour !== null).toSorted((a, b) => (b.bigMacPerHour ?? 0) - (a.bigMacPerHour ?? 0)),
    hourlyPower.filter(entry => entry.basketHours !== null).toSorted((a, b) => (a.basketHours ?? 0) - (b.basketHours ?? 0)),
    hourlyPower.filter(entry => entry.iphoneHours !== null).toSorted((a, b) => (a.iphoneHours ?? 0) - (b.iphoneHours ?? 0)),
    hourlyPower.filter(entry => entry.modelyHours !== null).toSorted((a, b) => (a.modelyHours ?? 0) - (b.modelyHours ?? 0)),
  ];

  const counts = new Map<string, number>();
  let topCountry = { count: 0, country: "", countryCode: "" };
  for (const ranking of rankings) {
    for (const item of ranking.slice(0, 3)) {
      const count = (counts.get(item.countryCode) ?? 0) + 1;
      counts.set(item.countryCode, count);
      if (count > topCountry.count) {
        topCountry = { count, country: item.country, countryCode: item.countryCode };
      }
    }
  }

  const spreads = [
    { entries: hourlyPower.filter(entry => entry.bigMacPerHour !== null), get: (entry: HourlyPowerEntry) => entry.bigMacPerHour ?? 0, label: "1 小时能买巨无霸" },
    { entries: hourlyPower.filter(entry => entry.basketHours !== null), get: (entry: HourlyPowerEntry) => entry.basketHours ?? 0, label: "买基础物资篮" },
    { entries: hourlyPower.filter(entry => entry.iphoneHours !== null), get: (entry: HourlyPowerEntry) => entry.iphoneHours ?? 0, label: "买 iPhone" },
    { entries: hourlyPower.filter(entry => entry.modelyHours !== null), get: (entry: HourlyPowerEntry) => entry.modelyHours ?? 0, label: "买 Model Y" },
  ].map((spread) => {
    const values = spread.entries.map(entry => spread.get(entry));
    return { label: spread.label, ratio: round1(Math.max(...values) / Math.min(...values)) };
  });
  const maxGap = spreads.toSorted((a, b) => b.ratio - a.ratio)[0];

  return { countryCount, maxGap, regionCount, topCountry };
}

/**
 * 五张卡片的最高/最低：统一走同一批已过滤空值的榜单，
 * 缺失数据不会因为排序而变成"最便宜"。
 */
function getIndexStats(): IndexStat[] {
  const byWage = hourlyPower.toSorted((a, b) => b.cnyHour - a.cnyHour);
  const withBigMac = hourlyPower.filter(entry => entry.bigMacPerHour !== null)
    .toSorted((a, b) => (b.bigMacPerHour ?? 0) - (a.bigMacPerHour ?? 0));
  const withBasket = hourlyPower.filter(entry => entry.basketHours !== null)
    .toSorted((a, b) => (a.basketHours ?? 0) - (b.basketHours ?? 0));
  const withIphone = hourlyPower.filter(entry => entry.iphoneHours !== null)
    .toSorted((a, b) => (a.iphoneHours ?? 0) - (b.iphoneHours ?? 0));
  const withModely = hourlyPower.filter(entry => entry.modelyHours !== null)
    .toSorted((a, b) => (a.modelyHours ?? 0) - (b.modelyHours ?? 0));

  return [
    {
      coverage: byWage.length,
      description: "折算人民币后的法定时薪，是购买力的基准线而非购买力本身",
      group: "工资基准",
      icon: "DollarSign",
      id: "wages",
      link: "/explore",
      linkLabel: "查看工资数据",
      metrics: [
        pair("最高", byWage[0], cnyHour(byWage[0].cnyHour)),
        pair("最低", byWage[byWage.length - 1], cnyHour(byWage[byWage.length - 1].cnyHour)),
      ],
      title: "最低工资",
    },
    {
      coverage: withBigMac.length,
      description: "当地时薪 ÷ 当地售价，全程不过汇率",
      group: "日常饮食",
      icon: "Beef",
      id: "bigmac",
      link: "/bigmac",
      linkLabel: "查看巨无霸指数",
      metrics: [
        pair("1 小时最多", withBigMac[0], `${withBigMac[0].bigMacPerHour} 个`),
        pair("1 小时最少", withBigMac[withBigMac.length - 1], `${withBigMac[withBigMac.length - 1].bigMacPerHour} 个`),
      ],
      title: "巨无霸指数",
    },
    {
      coverage: withBasket.length,
      description: "9 件基础食品篮总价 ÷ 时薪",
      group: "日常饮食",
      icon: "ShoppingBasket",
      id: "commodity",
      link: "/commodity",
      linkLabel: "查看物资指数",
      metrics: [
        pair("最少", withBasket[0], `${hourNumber(withBasket[0].basketHours)}h`),
        pair("最多", withBasket[withBasket.length - 1], `${hourNumber(withBasket[withBasket.length - 1].basketHours)}h`),
      ],
      title: "物资指数",
    },
    {
      coverage: withIphone.length,
      description: "Apple 官方商城标价折算后需工作多久",
      group: "随身物品",
      icon: "Smartphone",
      id: "iphone",
      link: "/iphone",
      linkLabel: "查看 iPhone 指数",
      metrics: [
        pair("最少", withIphone[0], `${hourNumber(withIphone[0].iphoneHours)}h`),
        pair("最多", withIphone[withIphone.length - 1], `${hourNumber(withIphone[withIphone.length - 1].iphoneHours)}h`),
      ],
      title: "iPhone 指数",
    },
    {
      coverage: withModely.length,
      description: "特斯拉官网标价折算后需工作多久",
      group: "大件耐用品",
      icon: "Car",
      id: "modely",
      link: "/modely",
      linkLabel: "查看 Model Y 指数",
      metrics: [
        pair("最少", withModely[0], `${hourNumber(withModely[0].modelyHours)}h`),
        pair("最多", withModely[withModely.length - 1], `${hourNumber(withModely[withModely.length - 1].modelyHours)}h`),
      ],
      title: "Model Y 指数",
    },
  ];
}

function pair(label: string, entry: HourlyPowerEntry, value: string) {
  return { country: entry.country, countryCode: entry.countryCode, label, value };
}

/**
 * 首页刻度尺：各国最低时薪按比例落在同一把尺上。
 * 默认对数刻度 —— 最高与最低相差十几倍，线性刻度会把绝大多数国家压在左端。
 */
function WageRuler() {
  const [scale, setScale] = React.useState<"linear" | "log">("log");
  const values = hourlyPower.map(entry => entry.cnyHour);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const logSpan = Math.log10(max) - Math.log10(min);
  const positionOf = (value: number) => {
    if (span === 0) {
      return 50;
    }
    const position = scale === "log"
      ? (Math.log10(value) - Math.log10(min)) / logSpan
      : (value - min) / span;
    return position * 100;
  };
  const lowest = hourlyPower.toSorted((a, b) => a.cnyHour - b.cnyHour)[0];
  const highest = hourlyPower.toSorted((a, b) => b.cnyHour - a.cnyHour)[0];
  const tickCount = 21;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">时薪刻度尺</p>
          <p className="mt-1 text-xs text-muted-foreground">
            税前法定最低工资 · 按市场汇率折算人民币
          </p>
        </div>
        <div className="flex items-center gap-1">
          {(["log", "linear"] as const).map(option => (
            <Button
              aria-pressed={scale === option}
              className={cn(scale === option && "border-primary text-primary")}
              key={option}
              onClick={() => setScale(option)}
              size="sm"
              variant="outline"
            >
              {option === "log" ? "对数" : "线性"}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CountryFlag className="h-4 w-4" countryCode={lowest.countryCode} />
          最低
          {" "}
          {lowest.country}
        </span>
        <span className="hidden sm:inline">人民币/小时</span>
        <span className="flex items-center gap-1.5">
          <CountryFlag className="h-4 w-4" countryCode={highest.countryCode} />
          {highest.country}
          {" "}
          最高
        </span>
      </div>

      <div
        aria-label={`全球最低时薪刻度尺：${lowest.country} ${cnyHour(min)} 至 ${highest.country} ${cnyHour(max)} 每小时，共 ${hourlyPower.length} 个国家/地区`}
        className="relative mt-2 h-9"
        role="img"
      >
        <div className="absolute inset-x-0 bottom-7 h-px bg-border" />
        {Array.from({ length: tickCount }, (_, index) => index).map(tick => (
          <span
            className={cn(
              "absolute bottom-3 h-4 w-px bg-border",
              tick % 5 === 0 ? "" : "bottom-5 h-2",
            )}
            key={tick}
            style={{ left: `${tick * 5}%` }}
          />
        ))}
        {[0, 25, 50, 75, 100].map((percent) => {
          const edge = percent === 0 ? "" : (percent === 100 ? "-translate-x-full" : "-translate-x-1/2");
          const value = scale === "log"
            ? 10 ** (Math.log10(min) + logSpan * percent / 100)
            : min + span * percent / 100;
          return (
            <span
              className={cn("absolute bottom-0 text-[10px] tabular-nums text-muted-foreground", edge)}
              key={percent}
              style={{ left: `${percent}%` }}
            >
              ¥
              {Math.round(value)}
            </span>
          );
        })}
        {hourlyPower.map(entry => (
          <span
            className="absolute bottom-7 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background"
            key={entry.countryCode}
            style={{ background: regionColor(entry.region), left: `${positionOf(entry.cnyHour)}%` }}
            title={`${entry.country} · ${cnyHour(entry.cnyHour)}/小时`}
          />
        ))}
      </div>

      <RegionLegend />

      <p className="mt-3 text-xs text-muted-foreground">
        首尾差距
        {" "}
        {formatRatio(max / min)}
        。最高与最低之间相差十几倍，线性刻度会把绝大多数国家挤在左端，因此默认用对数刻度。
      </p>
    </div>
  );
}
