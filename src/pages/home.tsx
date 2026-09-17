import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-6 pt-4">
        <div className="space-y-3">
          <h1 className="animate-fade-up font-display text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.1] tracking-tight">
            全球最低工资购买力对比
          </h1>
          <p className="animate-fade-up delay-100 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            以人民币折算时薪为统一基准，直观展示
            {" "}
            {count}
            {" "}
            个国家/地区的最低工资差异。
            数据覆盖亚洲、欧洲、大洋洲和北美，时效 2025-2026 年。
          </p>
        </div>

        <div className="animate-fade-up-lg delay-200 -mx-4 rounded-none border-y bg-card p-4 sm:-mx-6 sm:p-6">
          <h2 className="mb-4 font-medium text-muted-foreground text-caption">各地区最低时薪（人民币）排名</h2>
          <WageBarChart data={sortedByWage} layout="horizontal" />
        </div>
      </section>

      {/* Insight cards */}
      <section
        className={cn(
          "grid gap-3 transition-all duration-500 ease-out sm:grid-cols-3",
          visible ? "opacity-100" : "translate-y-2 opacity-0",
        )}
        ref={insightSectionRef}
      >
        {/* Card 1 — 最高 vs 最低 */}
        <Card className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-0.5 bg-primary" />
          <CardHeader className="pb-2">
            <CardTitle className="text-caption text-muted-foreground">最高 vs 最低</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="mr-1.5 text-lg">{countryFlag(highest.countryCode)}</span>
                <span className="font-display text-2xl">
                  ¥
                  {highest.cnyEquivalent}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">{highest.country}</span>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {ratio}
                ×
              </span>
              <div className="text-right">
                <span className="mr-1.5 text-lg">{countryFlag(lowest.countryCode)}</span>
                <span className="font-display text-2xl">
                  ¥
                  {lowest.cnyEquivalent}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">{lowest.country}</span>
              </div>
            </div>
            {/* Ratio bar */}
            <div className="relative h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${(lowest.cnyEquivalent / highest.cnyEquivalent) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2 — 区域差异 */}
        <Card className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-0.5" style={{ background: "var(--color-region-europe)" }} />
          <CardHeader className="pb-2">
            <CardTitle className="text-caption text-muted-foreground">区域平均时薪</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {regionData.map(r => (
              <div className="flex items-center gap-2" key={r.region}>
                <span className="w-8 shrink-0 text-xs text-muted-foreground">{r.region}</span>
                <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{
                      background: `var(--color-region-${regionVariableName(r.region)})`,
                      width: `${(r.avg / maxRegionAvg) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums">
                  ¥
                  {r.avg}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card 3 — 覆盖范围 */}
        <Card className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-0.5" style={{ background: "var(--color-region-asia)" }} />
          <CardHeader className="pb-2">
            <CardTitle className="text-caption text-muted-foreground">覆盖范围</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {wages.map(w => (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-sm transition-transform hover:scale-110"
                  key={w.countryCode}
                  title={`${w.country} · ¥${w.cnyEquivalent}`}
                >
                  {countryFlag(w.countryCode)}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {count}
              {" 个国家/地区 · "}
              {regionData.length}
              {" 个区域"}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="flex justify-center pt-4">
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
