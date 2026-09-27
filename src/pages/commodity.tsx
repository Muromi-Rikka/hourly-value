import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { CommodityIndexEntry } from "@/data/commodity-index";

import { CountryFlag } from "@/components/country-flag";
import { CommodityTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { RegionBreakdown } from "@/components/region-breakdown";
import { SourceBlock } from "@/components/source-block";
import { buttonVariants } from "@/components/ui/button";
import { COMMODITY_SOURCE } from "@/data/commodity";
import { sortedByHours } from "@/data/commodity-index";
import { hourNumber, round1 } from "@/lib/format";
import { regionAverages } from "@/lib/region";
import { cn } from "@/lib/utilities";

export function Commodity() {
  // 无工资数据的国家不参与任何「最贵/最便宜」结论
  const withHours = sortedByHours.filter((entry): entry is CommodityIndexEntry & { hoursToBuy: number } => entry.hoursToBuy !== null);
  const cheapest = withHours[0];
  const mostExpensive = withHours[withHours.length - 1];
  const count = withHours.length;
  // 大数字是裸除法，必须先舍入：CountUp 按 to.toString() 数小数位，
  // 不舍入会把 11.363636363636363 这种长尾全部画出来
  const ratio = round1(mostExpensive.hoursToBuy / cheapest.hoursToBuy);
  const regionData = regionAverages(withHours, entry => entry.hoursToBuy, { decimals: 1 });
  const maxRegionMedian = Math.max(...regionData.map(r => r.median));

  return (
    <div>
      {/* Hero */}
      <section className="hero overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="rule-top mb-6" />
        <SplitText
          className="hero-title max-w-3xl"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          tag="h1"
          text="物资篮子指数"
        />
        <AnimatedContent delay={0.1} distance={30} duration={0.6}>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            以各国最低时薪计算购买固定生活物资篮子（5kg面粉、5kg大米、1kg食糖、1kg食盐、2L牛奶、24个鸡蛋、5L食用油、1kg牛肉、1kg鸡肉）所需的工作小时数，
            {" "}
            {count}
            {" 个国家横向对比。"}
          </p>
        </AnimatedContent>
      </section>

      {/* Chart */}
      <AnimatedContent direction="vertical" distance={40} duration={0.8}>
        <section className="-mx-4 border-y sm:-mx-6">
          <div className="px-4 py-5 sm:px-6">
            <p className="mb-3 text-xs text-muted-foreground">
              购买
              {" "}
              {COMMODITY_SOURCE.date}
              {" 的价格快照 · 税前最低时薪 ÷ 篮子总价"}
            </p>
            <RankBarChart
              data={withHours}
              formatTick={value => `${value}h`}
              formatValue={value => `${value}h`}
              layout="horizontal"
              tooltip={CommodityTooltip}
              valueKey="hoursToBuy"
            />
          </div>
        </section>
      </AnimatedContent>

      {/* Insights */}
      <AnimatedContent distance={50} duration={0.8} threshold={0.15}>
        <section className="mt-10 sm:mt-12">
          <div className="mb-6">
            <p className="eyebrow">数据洞察</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-12 sm:gap-6">
            {/* Left — headline number */}
            <div className="sm:col-span-5">
              <p className="mb-2 text-sm text-muted-foreground">买一篮生活物资，最贵需要工作最便宜的</p>
              <p className="stat-number stat-xl">
                <CountUp duration={2} to={ratio} />
                <span className="text-[0.4em] text-muted-foreground">×</span>
              </p>
              <div className="mt-4 space-y-2">
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={mostExpensive.countryCode} />
                  <span className="stat-number text-xl">
                    {hourNumber(mostExpensive.hoursToBuy)}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">{mostExpensive.country}</span>
                </div>
                <div className="text-xs text-muted-foreground">—</div>
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={cheapest.countryCode} />
                  <span className="stat-number text-xl">
                    {hourNumber(cheapest.hoursToBuy)}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">{cheapest.country}</span>
                </div>
              </div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
                  style={{ transform: `scaleX(${cheapest.hoursToBuy / mostExpensive.hoursToBuy})` }}
                />
              </div>
            </div>

            {/* Right — region breakdown */}
            <div className="sm:col-span-7">
              <RegionBreakdown
                bars={regionData.map(r => ({
                  key: r.region,
                  label: r.region,
                  scale: r.median / maxRegionMedian,
                  value: (
                    <>
                      {r.median}
                      h
                      <span className="ml-1 font-normal text-muted-foreground">
                        （
                        {r.count}
                        ）
                      </span>
                    </>
                  ),
                }))}
                caption={(
                  <>
                    {count}
                    {" 个国家 · "}
                    {regionData.length}
                    {" 个区域"}
                  </>
                )}
                flags={withHours.map(w => ({
                  countryCode: w.countryCode,
                  key: w.countryCode,
                  title: `${w.country} · ${hourNumber(w.hoursToBuy)}h`,
                }))}
                subtitle="中位数不受极值国家影响，括号内为该区域收录国家数"
                title="区域所需工时中位数"
              />
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* Source */}
      <AnimatedContent delay={0.05} distance={25} duration={0.6}>
        <div className="mt-12 sm:mt-16">
          <SourceBlock
            note={COMMODITY_SOURCE.note ? `${COMMODITY_SOURCE.date}数据。${COMMODITY_SOURCE.note}。篮子构成：5kg面粉 · 5kg大米 · 1kg食糖 · 1kg食盐 · 2L牛奶 · 24个鸡蛋 · 5L食用油 · 1kg牛肉 · 1kg鸡肉` : undefined}
            sourceName={COMMODITY_SOURCE.name}
            sourceUrl={COMMODITY_SOURCE.url}
          />
        </div>
      </AnimatedContent>

      {/* CTA */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="section pb-4">
          <Link className={cn(buttonVariants({ size: "lg" }), "group")} to="/commodity-explore">
            开始探索数据
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </AnimatedContent>
    </div>
  );
}
