import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { CommodityIndexEntry } from "@/data/commodity-index";

import { CountryFlag } from "@/components/country-flag";
import { CommodityTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { FadeContent } from "@/components/react-bits/FadeContent/FadeContent";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { SourceBlock } from "@/components/source-block";
import { Button } from "@/components/ui/button";
import { COMMODITY_SOURCE } from "@/data/commodity";
import { sortedByHours } from "@/data/commodity-index";
import { hourNumber } from "@/lib/format";
import { regionAverages } from "@/lib/region";

export function Commodity() {
  // 无工资数据的国家不参与任何「最贵/最便宜」结论
  const withHours = sortedByHours.filter((entry): entry is CommodityIndexEntry & { hoursToBuy: number } => entry.hoursToBuy !== null);
  const cheapest = withHours[0];
  const mostExpensive = withHours[withHours.length - 1];
  const count = withHours.length;
  const ratio = mostExpensive.hoursToBuy / cheapest.hoursToBuy;
  const regionData = regionAverages(withHours, entry => entry.hoursToBuy, { decimals: 1 });
  const maxRegionMedian = Math.max(...regionData.map(r => r.median));

  return (
    <div>
      {/* Hero */}
      <section className="pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="rule-top mb-6" />
        <SplitText
          className="max-w-3xl font-display text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.05] tracking-[-0.03em]"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          tag="h1"
          text="物资篮子指数"
        />
        <AnimatedContent delay={0.1} distance={30} duration={0.6}>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
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
        <section>
          <div className="mt-10 mb-6 sm:mt-12">
            <p className="text-xs font-medium tracking-wider text-muted-foreground">数据洞察</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-12 sm:gap-6">
            {/* Left — headline number */}
            <div className="sm:col-span-5">
              <p className="mb-2 text-sm text-muted-foreground">买一篮生活物资，最贵需要工作最便宜的</p>
              <p className="font-display text-[clamp(3rem,8vw,6rem)] font-normal leading-none tracking-[-0.04em]">
                <CountUp duration={2} to={ratio} />
                <span className="text-[0.4em] text-muted-foreground">×</span>
              </p>
              <div className="mt-4 space-y-2">
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={mostExpensive.countryCode} />
                  <span className="font-display text-xl">
                    {hourNumber(mostExpensive.hoursToBuy)}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">{mostExpensive.country}</span>
                </div>
                <div className="text-xs text-muted-foreground">—</div>
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={cheapest.countryCode} />
                  <span className="font-display text-xl">
                    {hourNumber(cheapest.hoursToBuy)}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">{cheapest.country}</span>
                </div>
              </div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${(cheapest.hoursToBuy / mostExpensive.hoursToBuy) * 100}%` }}
                />
              </div>
            </div>

            {/* Right — region breakdown */}
            <div className="sm:col-span-7">
              <p className="mb-1 text-sm text-muted-foreground">区域所需工时中位数</p>
              <p className="mb-3 text-xs text-muted-foreground">中位数不受极值国家影响，括号内为该区域收录国家数</p>
              <FadeContent blur duration={800} threshold={0.2}>
                <div className="space-y-2.5">
                  {regionData.map(r => (
                    <div className="flex items-center gap-3" key={r.region}>
                      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{r.region}</span>
                      <div className="relative h-5 flex-1 overflow-hidden rounded-sm bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 rounded-sm bg-primary transition-all duration-700"
                          style={{
                            width: `${(r.median / maxRegionMedian) * 100}%`,
                          }}
                        />
                        <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold tabular-nums">
                          {r.median}
                          h
                          <span className="ml-1 font-normal text-muted-foreground">
                            （
                            {r.count}
                            ）
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeContent>

              {/* Flag strip */}
              <div className="mt-5 border-t pt-4">
                <p className="mb-2 text-xs text-muted-foreground">
                  {count}
                  {" 个国家 · "}
                  {regionData.length}
                  {" 个区域"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {withHours.map(w => (
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-sm transition-transform hover:scale-110"
                      key={w.countryCode}
                      title={`${w.country} · ${hourNumber(w.hoursToBuy)}h`}
                    >
                      <CountryFlag className="h-5 w-5" countryCode={w.countryCode} />
                    </span>
                  ))}
                </div>
              </div>
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
        <section className="mt-12 pb-4 sm:mt-16">
          <Link className="group" to="/commodity-explore">
            <Button className="rounded-full shadow-lg shadow-primary/20" size="lg">
              开始探索数据
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </section>
      </AnimatedContent>
    </div>
  );
}
