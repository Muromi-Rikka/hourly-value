import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { BigMacBarChart } from "@/components/bigmac-bar-chart";
import { BigMacPppChart } from "@/components/bigmac-ppp-chart";
import { CountryFlag } from "@/components/country-flag";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { FadeContent } from "@/components/react-bits/FadeContent/FadeContent";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { Button } from "@/components/ui/button";
import { bigmac, sortedByUsdPrice, sortedByValuation } from "@/data/bigmac";
import { sortedByBigMacPerHour } from "@/data/bigmac-ppp";

export function BigMac() {
  const cheapest = sortedByUsdPrice[sortedByUsdPrice.length - 1];
  const mostExpensive = sortedByUsdPrice[0];
  const count = bigmac.length;
  const mostOvervalued = sortedByValuation[0];
  const mostUndervalued = sortedByValuation[sortedByValuation.length - 1];
  const spread = Number((mostOvervalued.valuationPct - mostUndervalued.valuationPct).toFixed(1));
  const regionData = regionAverages();
  const maxRegionAvg = Math.max(...regionData.map(r => Math.abs(r.avg)));

  return (
    <div>
      {/* Hero — editorial statement */}
      <section className="pb-12 pt-6 sm:pb-16 sm:pt-8">
        <SplitText
          className="max-w-3xl font-display text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.05] tracking-[-0.03em]"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          tag="h1"
          text="巨无霸指数"
        />
        <AnimatedContent delay={0.1} distance={30} duration={0.6}>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
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
            <BigMacBarChart data={sortedByValuation} layout="horizontal" />
          </div>
        </section>
      </AnimatedContent>

      {/* Purchasing power chart */}
      <AnimatedContent delay={0.1} distance={40} duration={0.8}>
        <section className="mt-12 sm:mt-16">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">购买力对比</p>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              工作一小时能买几个巨无霸？
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              以各国法定最低时薪除以当地巨无霸售价，直观体现最低工资的实际购买力。
            </p>
          </div>
          <div className="-mx-4 border-y sm:-mx-6">
            <div className="px-4 py-5 sm:px-6">
              <BigMacPppChart data={sortedByBigMacPerHour} layout="horizontal" />
            </div>
          </div>
        </section>
      </AnimatedContent>

      {/* Insight — editorial spread */}
      <AnimatedContent distance={50} duration={0.8} threshold={0.15}>
        <section>
          {/* Headline row */}
          <div className="mt-10 mb-6 sm:mt-12">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">数据洞察</p>
          </div>

          {/* Two-column editorial layout */}
          <div className="grid gap-8 sm:grid-cols-12 sm:gap-6">
            {/* Left — the headline number */}
            <div className="sm:col-span-5">
              <p className="mb-2 text-sm text-muted-foreground">货币高估与低估的最大差距</p>
              <p className="font-display text-[clamp(3rem,8vw,6rem)] font-normal leading-none tracking-[-0.04em]">
                <CountUp duration={2} to={spread} />
                <span className="text-[0.4em] text-muted-foreground">%</span>
              </p>
              <div className="mt-4 space-y-2">
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={mostOvervalued.countryCode} />
                  <span className="font-display text-xl">
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
                  <span className="font-display text-xl">
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
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${((mostOvervalued.valuationPct - mostUndervalued.valuationPct) / (mostOvervalued.valuationPct - mostUndervalued.valuationPct)) * 100}%` }}
                />
              </div>
            </div>

            {/* Right — region breakdown */}
            <div className="sm:col-span-7">
              <p className="mb-3 text-sm text-muted-foreground">区域平均估值偏差</p>
              <FadeContent blur duration={800} threshold={0.2}>
                <div className="space-y-2.5">
                  {regionData.map(r => (
                    <div className="flex items-center gap-3" key={r.region}>
                      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{r.region}</span>
                      <div className="relative h-5 flex-1 overflow-hidden rounded-sm bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 rounded-sm transition-all duration-700"
                          style={{
                            background: `var(--color-region-${regionVariableName(r.region)})`,
                            width: `${(Math.abs(r.avg) / maxRegionAvg) * 100}%`,
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
                    <span className="ml-auto font-display text-lg tabular-nums">
                      $
                      {mostExpensive.usdPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CountryFlag className="h-4 w-4" countryCode={cheapest.countryCode} />
                    <span className="text-sm font-medium">{cheapest.country}</span>
                    <span className="ml-auto font-display text-lg tabular-nums">
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
                    <span className="ml-auto font-display text-lg tabular-nums">
                      {sortedByBigMacPerHour[0].bigMacPerHour}
                      个
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CountryFlag className="h-4 w-4" countryCode={sortedByBigMacPerHour[sortedByBigMacPerHour.length - 1].countryCode} />
                    <span className="text-sm font-medium">{sortedByBigMacPerHour[sortedByBigMacPerHour.length - 1].country}</span>
                    <span className="ml-auto font-display text-lg tabular-nums">
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

      {/* CTA */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="mt-12 pb-4 sm:mt-16">
          <Button asChild className="group" size="lg">
            <Link to="/bigmac-explore">
              开始探索数据
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </section>
      </AnimatedContent>
    </div>
  );
}

function regionAverages(): Array<{ avg: number; count: number; region: string }> {
  const map = new Map<string, number[]>();
  for (const w of bigmac) {
    const array = map.get(w.region);
    if (array) {
      array.push(w.valuationPct);
    }
    else {
      map.set(w.region, [w.valuationPct]);
    }
  }
  return map
    .entries()
    .map(([region, vals]) => ({ avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10, count: vals.length, region }))
    .toArray()
    .toSorted((a, b) => b.avg - a.avg);
}

function regionVariableName(region: string): string {
  if (region === "北美") {
    return "north-america";
  }
  if (region === "亚洲") {
    return "asia";
  }
  if (region === "欧洲") {
    return "europe";
  }
  return "oceania";
}
