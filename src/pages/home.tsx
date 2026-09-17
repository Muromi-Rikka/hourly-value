import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { WageBarChart } from "@/components/wage-bar-chart";
import { sortedByWage, wages } from "@/data/wages";
import { cn } from "@/lib/utilities";

export function Home() {
  const highest = sortedByWage[0];
  const lowest = sortedByWage[sortedByWage.length - 1];
  const count = sortedByWage.length;
  const ratio = (highest.cnyEquivalent / lowest.cnyEquivalent).toFixed(1);
  const regionData = regionAverages();
  const maxRegionAvg = Math.max(...regionData.map(r => r.avg));

  const insightSectionRef = React.useRef<HTMLDivElement>(null); // eslint-disable-line unicorn/name-replacements -- "Ref" required by react/naming-convention-ref-name
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const element = insightSectionRef.current;
    if (!element) {
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react/set-state-in-effect -- intentional synchronous reveal for reduced-motion
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
        setVisible(true);
        obs.disconnect();
      },
      { threshold: 0.15 },
    );
    obs.observe(element);
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      {/* Hero — editorial statement */}
      <section className="pb-12 pt-6 sm:pb-16 sm:pt-8">
        <h1 className="animate-fade-up max-w-3xl font-display text-[clamp(2.8rem,6vw,5rem)] font-normal leading-[1.05] tracking-[-0.03em]">
          全球最低工资购买力对比
        </h1>
        <p className="animate-fade-up delay-100 mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
          以人民币折算时薪为统一基准，直观展示
          {" "}
          {count}
          {" "}
          个国家/地区的最低工资差异。数据覆盖亚洲、欧洲、大洋洲和北美，时效 2025-2026 年。
        </p>
      </section>

      {/* Chart — full-width data moment */}
      <section className="animate-fade-up-lg delay-200 -mx-4 border-y sm:-mx-6">
        <div className="px-4 py-5 sm:px-6">
          <WageBarChart data={sortedByWage} layout="horizontal" />
        </div>
      </section>

      {/* Insight — editorial spread, not card grid */}
      <section
        className={cn(
          "transition-all duration-500 ease-out",
          visible ? "opacity-100" : "translate-y-2 opacity-0",
        )}
        ref={insightSectionRef}
      >
        {/* Headline row */}
        <div className="mt-10 mb-6 sm:mt-12">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">数据洞察</p>
        </div>

        {/* Two-column editorial layout */}
        <div className="grid gap-8 sm:grid-cols-12 sm:gap-6">
          {/* Left — the headline number */}
          <div className="sm:col-span-5">
            <p className="mb-2 text-sm text-muted-foreground">最高时薪是最低的</p>
            <p className="font-display text-[clamp(3rem,8vw,6rem)] font-normal leading-none tracking-[-0.04em]">
              {ratio}
              <span className="text-[0.4em] text-muted-foreground">×</span>
            </p>
            <div className="mt-4 flex items-baseline gap-3">
              <div>
                <span className="mr-1 text-base">{countryFlag(highest.countryCode)}</span>
                <span className="font-display text-xl">
                  ¥
                  {highest.cnyEquivalent}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">{highest.country}</span>
              </div>
              <span className="text-muted-foreground">—</span>
              <div>
                <span className="mr-1 text-base">{countryFlag(lowest.countryCode)}</span>
                <span className="font-display text-xl">
                  ¥
                  {lowest.cnyEquivalent}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">{lowest.country}</span>
              </div>
            </div>
            <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${(lowest.cnyEquivalent / highest.cnyEquivalent) * 100}%` }}
              />
            </div>
          </div>

          {/* Right — region breakdown */}
          <div className="sm:col-span-7">
            <p className="mb-3 text-sm text-muted-foreground">区域平均时薪</p>
            <div className="space-y-2.5">
              {regionData.map(r => (
                <div className="flex items-center gap-3" key={r.region}>
                  <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{r.region}</span>
                  <div className="relative h-5 flex-1 overflow-hidden rounded-sm bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-sm transition-all duration-700"
                      style={{
                        background: `var(--color-region-${regionVariableName(r.region)})`,
                        width: `${(r.avg / maxRegionAvg) * 100}%`,
                      }}
                    />
                    <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold tabular-nums">
                      ¥
                      {r.avg}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Flag strip */}
            <div className="mt-5 border-t pt-4">
              <p className="mb-2 text-xs text-muted-foreground">
                {count}
                {" 个国家/地区 · "}
                {regionData.length}
                {" 个区域"}
              </p>
              <div className="flex flex-wrap gap-1">
                {wages.map(w => (
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-sm text-sm transition-transform hover:scale-110"
                    key={w.countryCode}
                    title={`${w.country} · ¥${w.cnyEquivalent}`}
                  >
                    {countryFlag(w.countryCode)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — not centered, anchored left */}
      <section className="mt-12 pb-4 sm:mt-16">
        <Button asChild className="animate-fade-up delay-300 group" size="lg">
          <Link to="/explore">
            开始探索数据
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

function countryFlag(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(c => 127_397 + c.codePointAt(0)!),
  );
}

function regionAverages(): Array<{ avg: number; count: number; region: string }> {
  const map = new Map<string, number[]>();
  for (const w of wages) {
    const array = map.get(w.region) ?? [];
    array.push(w.cnyEquivalent);
    map.set(w.region, array);
  }
  return map
    .entries()
    .map(([region, vals]) => ({
      avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
      count: vals.length,
      region,
    }))
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
