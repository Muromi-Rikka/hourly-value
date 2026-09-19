import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { CountryFlag } from "@/components/country-flag";
import { IPhoneBarChart } from "@/components/iphone-bar-chart";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { CountUp } from "@/components/react-bits/CountUp/CountUp";
import { FadeContent } from "@/components/react-bits/FadeContent/FadeContent";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { Button } from "@/components/ui/button";
import { iphoneIndex, sortedByHours } from "@/data/iphone-index";

export function IPhone() {
  // Only entries with actual hours data
  const withHours = sortedByHours.filter(entry => entry.hoursToBuy !== null);
  const cheapest = withHours[0];
  const mostExpensive = withHours[withHours.length - 1];
  const count = withHours.length;
  const ratio = Number((mostExpensive.hoursToBuy! / cheapest.hoursToBuy!).toFixed(1));
  const regionData = regionAverages();
  const maxRegionAvg = Math.max(...regionData.map(r => r.avg));

  return (
    <div>
      {/* Hero — editorial statement */}
      <section className="pb-12 pt-6 sm:pb-16 sm:pt-8">
        <div className="gradient-accent mb-6" />
        <SplitText
          className="max-w-3xl font-display text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.05] tracking-[-0.03em]"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          tag="h1"
          text="iPhone 全球购买力指数"
        />
        <AnimatedContent delay={0.1} distance={30} duration={0.6}>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            以各国最低时薪计算购买一台 iPhone 18 Pro (256GB) 所需的工作小时数，
            {" "}
            {count}
            {" "}
            个国家/地区横向对比，直观呈现全球购买力差异。
          </p>
        </AnimatedContent>
      </section>

      {/* Chart — full-width data moment */}
      <AnimatedContent direction="vertical" distance={40} duration={0.8}>
        <section className="-mx-4 border-y sm:-mx-6">
          <div className="px-4 py-5 sm:px-6">
            <IPhoneBarChart data={sortedByHours} layout="horizontal" />
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
              <p className="mb-2 text-sm text-muted-foreground">买一台 iPhone，最贵需要工作最便宜的</p>
              <p className="font-display text-[clamp(3rem,8vw,6rem)] font-normal leading-none tracking-[-0.04em]">
                <CountUp duration={2} to={ratio} />
                <span className="text-[0.4em] text-muted-foreground">×</span>
              </p>
              <div className="mt-4 space-y-2">
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={mostExpensive.countryCode} />
                  <span className="font-display text-xl">
                    {mostExpensive.hoursToBuy}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">{mostExpensive.country}</span>
                </div>
                <div className="text-xs text-muted-foreground">—</div>
                <div className="inline-flex items-center gap-1.5">
                  <CountryFlag className="h-5 w-5" countryCode={cheapest.countryCode} />
                  <span className="font-display text-xl">
                    {cheapest.hoursToBuy}
                    h
                  </span>
                  <span className="text-xs text-muted-foreground">{cheapest.country}</span>
                </div>
              </div>
              <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${(cheapest.hoursToBuy! / mostExpensive.hoursToBuy!) * 100}%` }}
                />
              </div>
            </div>

            {/* Right — region breakdown */}
            <div className="sm:col-span-7">
              <p className="mb-3 text-sm text-muted-foreground">区域平均所需工时</p>
              <FadeContent blur duration={800} threshold={0.2}>
                <div className="space-y-2.5">
                  {regionData.map(r => (
                    <div className="flex items-center gap-3" key={r.region}>
                      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{r.region}</span>
                      <div className="relative h-5 flex-1 overflow-hidden rounded-sm bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 rounded-sm bg-gradient-to-r from-primary to-accent-warm transition-all duration-700"
                          style={{
                            width: `${(r.avg / maxRegionAvg) * 100}%`,
                          }}
                        />
                        <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold tabular-nums">
                          {r.avg}
                          h
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
                      title={`${w.country} · ${w.hoursToBuy}h`}
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

      {/* CTA */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="mt-12 pb-4 sm:mt-16">
          <Link className="group" to="/iphone-explore">
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

function regionAverages(): Array<{ avg: number; count: number; region: string }> {
  const entries = iphoneIndex.filter(entry => entry.hoursToBuy !== null);
  const map = new Map<string, number[]>();
  for (const w of entries) {
    const array = map.get(w.region);
    if (array) {
      array.push(w.hoursToBuy!);
    }
    else {
      map.set(w.region, [w.hoursToBuy!]);
    }
  }
  return map
    .entries()
    .map(([region, vals]) => ({ avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length), count: vals.length, region }))
    .toArray()
    .toSorted((a, b) => a.avg - b.avg);
}
