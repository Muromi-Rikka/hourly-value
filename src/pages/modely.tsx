import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { ModelYIndexEntry } from "@/data/modely-index";

import { CountryFlag } from "@/components/country-flag";
import { ModelYTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { FadeContent } from "@/components/react-bits/FadeContent/FadeContent";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { SourceBlock } from "@/components/source-block";
import { buttonVariants } from "@/components/ui/button";
import { MODELY_SOURCE } from "@/data/modely";
import { sortedByHours } from "@/data/modely-index";
import { hourNumber, hours, round1 } from "@/lib/format";
import { regionAverages } from "@/lib/region";
import { cn } from "@/lib/utilities";

export function ModelY() {
  // 以小时为主指标：不同国家的法定周工时不同，"天数"只是按每天 8 小时的换算
  const withHours = sortedByHours.filter((entry): entry is ModelYIndexEntry & { hoursToBuy: number } => entry.hoursToBuy !== null);
  const cheapest = withHours[0];
  const mostExpensive = withHours[withHours.length - 1];
  const count = withHours.length;
  // 与物资页同一条规则：裸除法必须先舍入，否则 CountUp 会数出十几位小数
  const ratio = round1(mostExpensive.hoursToBuy / cheapest.hoursToBuy);
  const regionData = regionAverages(withHours, entry => entry.hoursToBuy, { decimals: 1 });
  const maxRegionMedian = Math.max(...regionData.map(r => r.median));

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
          text="Model Y 全球购买力指数"
        />
        <AnimatedContent delay={0.1} distance={30} duration={0.6}>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            以各国最低时薪计算买一辆 Tesla Model Y 后驱版需要工作多少小时，
            {" "}
            {count}
            {" "}
            个国家/地区横向对比。天数只是按每天 8 小时的换算，跨地区请以小时为准。
          </p>
        </AnimatedContent>
      </section>

      {/* Chart — full-width data moment */}
      <AnimatedContent direction="vertical" distance={40} duration={0.8}>
        <section className="-mx-4 border-y sm:-mx-6">
          <div className="px-4 py-5 sm:px-6">
            <p className="mb-3 text-xs text-muted-foreground">
              税前最低时薪 ÷ 官网标价折算人民币 · 各地区含税口径见探索页
            </p>
            <RankBarChart
              data={withHours}
              formatTick={value => `${Math.round(value)}h`}
              formatValue={value => hours(value)}
              layout="horizontal"
              tooltip={ModelYTooltip}
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
              <p className="mb-2 text-sm text-muted-foreground">买一辆 Model Y，最贵需要工作最便宜的</p>
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
                  <span className="text-xs text-muted-foreground">
                    {mostExpensive.country}
                    {" · 约 "}
                    {mostExpensive.daysToBuy}
                    {" 天"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">—</div>
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={cheapest.countryCode} />
                  <span className="stat-number text-xl">
                    {hourNumber(cheapest.hoursToBuy)}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {cheapest.country}
                    {" · 约 "}
                    {cheapest.daysToBuy}
                    {" 天"}
                  </span>
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
              <p className="mb-1 text-sm text-muted-foreground">区域所需工时中位数</p>
              <p className="mb-3 text-xs text-muted-foreground">括号内为该区域收录国家数；中位数不受极值国家影响</p>
              <FadeContent duration={800} threshold={0.2}>
                <div className="space-y-2.5">
                  {regionData.map(r => (
                    <div className="flex items-center gap-3" key={r.region}>
                      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{r.region}</span>
                      <div className="relative h-5 flex-1 overflow-hidden rounded-sm bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 w-full origin-left rounded-sm bg-primary transition-transform duration-300 ease-out"
                          style={{
                            transform: `scaleX(${r.median / maxRegionMedian})`,
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
                  {" 个国家/地区 · "}
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
            note={MODELY_SOURCE.note}
            sourceName={MODELY_SOURCE.name}
            sourceUrl={MODELY_SOURCE.url}
          />
        </div>
      </AnimatedContent>

      {/* CTA */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="section pb-4">
          <Link className={cn(buttonVariants({ size: "lg" }), "group")} to="/modely-explore">
            开始探索数据
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </AnimatedContent>
    </div>
  );
}
