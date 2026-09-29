import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import type { IPhoneIndexEntry } from "@/data/iphone-index";
import { CountryFlag } from "@/components/country-flag";
import { createIPhoneTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { RegionBreakdown } from "@/components/region-breakdown";
import { SourceBlock } from "@/components/source-block";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IPHONE_SOURCE } from "@/data/iphone";
import { sortedByHoursDuo } from "@/data/iphone-duo-index";
import { sortedByHours } from "@/data/iphone-index";
import { regionAverages } from "@/lib/region";
import { cn } from "@/lib/utilities";

type ModelKey = "duo" | "pro18";

const MODEL_CONFIG: Record<ModelKey, { sorted: IPhoneIndexEntry[]; sub: string }> = {
  duo: {
    sorted: sortedByHoursDuo,
    sub: "iPhone Duo",
  },
  pro18: {
    sorted: sortedByHours,
    sub: "iPhone 18 Pro (256GB)",
  },
};

export function IPhone() {
  const [model, setModel] = React.useState<ModelKey>("pro18");
  const config = MODEL_CONFIG[model];
  const { sorted, sub } = config;

  // Only entries with actual hours data
  const withHours = sorted.filter(entry => entry.hoursToBuy !== null);
  // 稳定引用：每次渲染都新建 tooltip 组件会让 Recharts 反复卸载重挂
  // （同 hourly.tsx:196）。依赖写 model 而不是 withHours —— 后者每渲染都是新数组
  const IPhoneTooltip = React.useMemo(
    () => createIPhoneTooltip(MODEL_CONFIG[model].sorted.filter(entry => entry.hoursToBuy !== null)),
    [model],
  );
  const cheapest = withHours[0];
  const mostExpensive = withHours[withHours.length - 1];
  const count = withHours.length;
  const ratio = Number((mostExpensive.hoursToBuy! / cheapest.hoursToBuy!).toFixed(1));
  const regionData = regionAverages(withHours, entry => entry.hoursToBuy!);
  const maxRegionAvg = Math.max(...regionData.map(r => r.avg));

  return (
    <div>
      {/* Hero — editorial statement */}
      <section className="hero overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="rule-top mb-6" />
        <SplitText
          className="hero-title max-w-3xl"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          tag="h1"
          text="iPhone 全球购买力指数"
        />
        <AnimatedContent delay={0.1} distance={30} duration={0.6}>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            以各国最低时薪计算购买一台
            {" "}
            {sub}
            {" "}
            所需的工作小时数，
            {" "}
            {count}
            {" "}
            个国家/地区横向对比，直观呈现全球购买力差异。
          </p>
        </AnimatedContent>
        <AnimatedContent delay={0.15} distance={20} duration={0.5}>
          <Tabs className="mt-5" onValueChange={v => setModel(v as ModelKey)} value={model}>
            <TabsList>
              <TabsTrigger value="pro18">iPhone 18 Pro</TabsTrigger>
              <TabsTrigger value="duo">iPhone Duo</TabsTrigger>
            </TabsList>
          </Tabs>
        </AnimatedContent>
      </section>

      {/* Chart — full-width data moment */}
      <AnimatedContent direction="vertical" distance={40} duration={0.8}>
        <section className="-mx-4 border-y sm:-mx-6">
          <div className="px-4 py-5 sm:px-6">
            <RankBarChart
              data={withHours}
              formatTick={value => `${value}h`}
              formatValue={value => `${value}h`}
              key={model}
              layout="horizontal"
              tooltip={IPhoneTooltip}
              valueKey="hoursToBuy"
            />
          </div>
        </section>
      </AnimatedContent>

      {/* Insight — editorial spread */}
      <AnimatedContent distance={50} duration={0.8} threshold={0.15}>
        <section className="mt-10 sm:mt-12">
          {/* Headline row */}
          <div className="mb-6">
            <p className="eyebrow">数据洞察</p>
          </div>

          {/* Two-column editorial layout */}
          <div className="grid gap-8 sm:grid-cols-12 sm:gap-6">
            {/* Left — the headline number */}
            <div className="sm:col-span-5">
              <p className="mb-2 text-sm text-muted-foreground">买一台 iPhone，最贵需要工作最便宜的</p>
              <p className="stat-number stat-xl">
                <CountUp duration={2} to={ratio} />
                <span className="text-[0.4em] text-muted-foreground">×</span>
              </p>
              <div className="mt-4 space-y-2">
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={mostExpensive.countryCode} />
                  <span className="stat-number text-xl">
                    {mostExpensive.hoursToBuy}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">{mostExpensive.country}</span>
                </div>
                <div className="text-xs text-muted-foreground">—</div>
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={cheapest.countryCode} />
                  <span className="stat-number text-xl">
                    {cheapest.hoursToBuy}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">{cheapest.country}</span>
                </div>
              </div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
                  style={{ transform: `scaleX(${cheapest.hoursToBuy! / mostExpensive.hoursToBuy!})` }}
                />
              </div>
            </div>

            {/* Right — region breakdown */}
            <div className="sm:col-span-7">
              <RegionBreakdown
                bars={regionData.map(r => ({
                  key: r.region,
                  label: r.region,
                  scale: r.avg / maxRegionAvg,
                  value: (
                    <>
                      {r.avg}
                      h
                    </>
                  ),
                }))}
                caption={(
                  <>
                    {count}
                    {" 个国家/地区 · "}
                    {regionData.length}
                    {" 个区域"}
                  </>
                )}
                flags={withHours.map(w => ({
                  countryCode: w.countryCode,
                  key: w.countryCode,
                  title: `${w.country} · ${w.hoursToBuy}h`,
                }))}
                title="区域平均所需工时"
              />
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* Source */}
      <AnimatedContent delay={0.05} distance={25} duration={0.6}>
        <div className="mt-12 sm:mt-16">
          <SourceBlock
            note={IPHONE_SOURCE.note}
            sourceName={IPHONE_SOURCE.name}
            sourceUrl={IPHONE_SOURCE.url}
          />
        </div>
      </AnimatedContent>

      {/* CTA */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="section pb-4">
          <Link className={cn(buttonVariants({ size: "lg" }), "group")} to="/iphone-explore">
            开始探索数据
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </AnimatedContent>
    </div>
  );
}
