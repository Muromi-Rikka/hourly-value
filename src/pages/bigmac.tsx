import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CountryFlag } from "@/components/country-flag";
import { BigMacPppTooltip, BigMacTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { FadeContent } from "@/components/react-bits/FadeContent/FadeContent";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { SectionHeading } from "@/components/section-heading";
import { SourceBlock } from "@/components/source-block";
import { buttonVariants } from "@/components/ui/button";
import { bigmac, BIGMAC_SOURCE, sortedByUsdPrice, sortedByValuation } from "@/data/bigmac";
import { sortedByBigMacPerHour } from "@/data/bigmac-ppp";
import { regionAverages } from "@/lib/region";
import { cn } from "@/lib/utilities";

export function BigMac() {
  const cheapest = sortedByUsdPrice[sortedByUsdPrice.length - 1];
  const mostExpensive = sortedByUsdPrice[0];
  const count = bigmac.length;
  const mostOvervalued = sortedByValuation[0];
  const mostUndervalued = sortedByValuation[sortedByValuation.length - 1];
  const spread = Number((mostOvervalued.valuationPct - mostUndervalued.valuationPct).toFixed(1));
  const regionData = regionAverages(bigmac, entry => entry.valuationPct, { decimals: 1, order: "desc" });
  const maxRegionAvg = Math.max(...regionData.map(r => Math.abs(r.avg)));

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
          text="巨无霸指数"
        />
        <AnimatedContent delay={0.1} distance={30} duration={0.6}>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            基于《经济学人》的巨无霸指数方法论，以各国麦当劳巨无霸汉堡的零售价格对比美元汇率，
            {" "}
            {count}
            {" "}
            个国家/地区的货币高估与低估程度一目了然。
          </p>
        </AnimatedContent>
      </section>

      {/* Chart — full-width data moment */}
      <AnimatedContent direction="vertical" distance={40} duration={0.8}>
        <section className="-mx-4 border-y sm:-mx-6">
          <div className="px-4 py-5 sm:px-6">
            <RankBarChart
              data={bigmac}
              formatTick={value => `${value}%`}
              formatValue={value => `${value > 0 ? "+" : ""}${value}%`}
              layout="horizontal"
              showZeroLine
              tooltip={BigMacTooltip}
              valueKey="valuationPct"
            />
          </div>
        </section>
      </AnimatedContent>

      {/* Purchasing power chart */}
      <AnimatedContent delay={0.1} distance={40} duration={0.8}>
        <section className="section">
          <SectionHeading
            description="以各国法定最低时薪除以当地巨无霸售价，直观体现最低工资的实际购买力。"
            eyebrow="购买力对比"
            title="工作一小时能买几个巨无霸？"
          />
          <div className="-mx-4 border-y sm:-mx-6">
            <div className="px-4 py-5 sm:px-6">
              <RankBarChart
                data={sortedByBigMacPerHour}
                formatTick={value => `${value}个`}
                formatValue={value => `${value}个`}
                layout="horizontal"
                tooltip={BigMacPppTooltip}
                valueKey="bigMacPerHour"
              />
            </div>
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
              <p className="mb-2 text-sm text-muted-foreground">货币高估与低估的最大差距</p>
              <p className="stat-number stat-xl">
                <CountUp duration={2} to={spread} />
                <span className="text-[0.4em] text-muted-foreground">%</span>
              </p>
              <div className="mt-4 space-y-2">
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={mostOvervalued.countryCode} />
                  <span className="stat-number text-xl">
                    +
                    {mostOvervalued.valuationPct}
                    %
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mostOvervalued.country}
                    （高估）
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">—</div>
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={mostUndervalued.countryCode} />
                  <span className="stat-number text-xl">
                    {mostUndervalued.valuationPct}
                    %
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mostUndervalued.country}
                    （低估）
                  </span>
                </div>
              </div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
                  style={{ transform: `scaleX(${spread > 0 ? Math.min(1, Math.abs(mostUndervalued.valuationPct) / spread) : 1})` }}
                />
              </div>
            </div>

            {/* Right — region breakdown */}
            <div className="sm:col-span-7">
              <p className="mb-3 text-sm text-muted-foreground">区域平均估值偏差</p>
              <FadeContent duration={800} threshold={0.2}>
                <div className="space-y-2.5">
                  {regionData.map(r => (
                    <div className="flex items-center gap-3" key={r.region}>
                      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{r.region}</span>
                      <div className="relative h-5 flex-1 overflow-hidden rounded-sm bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 w-full origin-left rounded-sm bg-primary transition-transform duration-300 ease-out"
                          style={{
                            transform: `scaleX(${Math.abs(r.avg) / maxRegionAvg})`,
                          }}
                        />
                        <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold tabular-nums">
                          {r.avg > 0 ? "+" : ""}
                          {r.avg}
                          %
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
                  {bigmac.map(w => (
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-sm transition-transform hover:scale-110"
                      key={w.countryCode}
                      title={`${w.country} · ${w.valuationPct > 0 ? "+" : ""}${w.valuationPct}%`}
                    >
                      <CountryFlag className="h-5 w-5" countryCode={w.countryCode} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Price comparison */}
              <div className="mt-5 border-t pt-4">
                <p className="mb-2 text-sm text-muted-foreground">巨无霸美元价格对比</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CountryFlag className="h-4 w-4" countryCode={mostExpensive.countryCode} />
                    <span className="text-sm font-medium">{mostExpensive.country}</span>
                    <span className="ml-auto stat-number text-lg">
                      $
                      {mostExpensive.usdPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CountryFlag className="h-4 w-4" countryCode={cheapest.countryCode} />
                    <span className="text-sm font-medium">{cheapest.country}</span>
                    <span className="ml-auto stat-number text-lg">
                      $
                      {cheapest.usdPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    价格比：
                    {(mostExpensive.usdPrice / cheapest.usdPrice).toFixed(1)}
                    x
                  </p>
                </div>
              </div>

              {/* Purchasing power highlight */}
              <div className="mt-5 border-t pt-4">
                <p className="mb-2 text-sm text-muted-foreground">工作一小时能买几个巨无霸？</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CountryFlag className="h-4 w-4" countryCode={sortedByBigMacPerHour[0].countryCode} />
                    <span className="text-sm font-medium">{sortedByBigMacPerHour[0].country}</span>
                    <span className="ml-auto stat-number text-lg">
                      {sortedByBigMacPerHour[0].bigMacPerHour}
                      个
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CountryFlag className="h-4 w-4" countryCode={sortedByBigMacPerHour[sortedByBigMacPerHour.length - 1].countryCode} />
                    <span className="text-sm font-medium">{sortedByBigMacPerHour[sortedByBigMacPerHour.length - 1].country}</span>
                    <span className="ml-auto stat-number text-lg">
                      {sortedByBigMacPerHour[sortedByBigMacPerHour.length - 1].bigMacPerHour}
                      个
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    最高是最低的
                    {" "}
                    {(sortedByBigMacPerHour[0].bigMacPerHour / sortedByBigMacPerHour[sortedByBigMacPerHour.length - 1].bigMacPerHour).toFixed(1)}
                    x
                  </p>
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
            note={`${BIGMAC_SOURCE.note}。美国基准价 $6.22。`}
            sourceName={BIGMAC_SOURCE.name}
            sourceUrl={BIGMAC_SOURCE.url}
          />
        </div>
      </AnimatedContent>

      {/* CTA */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="section pb-4">
          <Link className={cn(buttonVariants({ size: "lg" }), "group")} to="/bigmac-explore">
            开始探索数据
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </AnimatedContent>
    </div>
  );
}
