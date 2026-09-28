import type * as React from "react";

import type { HourlyMetric, HourlyPowerEntry } from "@/data/hourly-power";

import { CountryFlag } from "@/components/country-flag";
import { CoverageBadge } from "@/components/coverage-badge";
import { RegionBadge } from "@/components/region-badge";
import { cardVariants } from "@/components/ui/card";
import { METRIC_GROUP_LABEL, metricFor, workWeeks } from "@/data/hourly-power";
import { DASH, dateOnly, localAmount, round1 } from "@/lib/format";
import { cn } from "@/lib/utilities";

interface HourlyWalletProperties {
  children?: React.ReactNode;
  className?: string;
  entry: HourlyPowerEntry;
}

const TILE_KEYS: HourlyMetric["key"][] = ["bigMacPerHour", "basketHours", "iphoneHours", "modelyHours"];

/**
 * 「一小时钱包」：一个国家的一小时最低工资能买到什么。
 * 指标定义全部来自 `@/data/hourly-power` 的 HOURLY_METRICS，此处只负责排版。
 */
export function HourlyWallet({ children, className, entry }: HourlyWalletProperties) {
  const wageMetric = metricFor("cnyHour");
  const tiles = TILE_KEYS
    .map(key => metricFor(key))
    .filter((metric): metric is HourlyMetric => metric !== undefined);

  return (
    <div className={cn(cardVariants({ variant: "raised" }), "p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <CountryFlag className="h-11 w-11" countryCode={entry.countryCode} />
          <div>
            <p className="flex items-center gap-2 font-display text-2xl">
              {entry.country}
              <CoverageBadge coverage={entry.coverage} />
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <RegionBadge region={entry.region} />
              <span>
                {dateOnly(entry.effectiveDate)}
                {" 生效"}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>
            最低时薪
            {" "}
            {localAmount(entry.localWage, entry.localUnit)}
          </p>
          <p className={cn("mt-1", entry.isProxy && "text-primary")}>
            {entry.isProxy ? "代理值 · 无全国统一标准" : "全国统一法定标准"}
          </p>
        </div>
      </div>

      {children ? <div className="mt-5 border-t pt-5">{children}</div> : null}

      {wageMetric
        ? (
            <div className="mt-5 rounded-lg bg-primary p-4 text-primary-foreground">
              <p className="text-xs">{METRIC_GROUP_LABEL[wageMetric.group]}</p>
              <p className="mt-1 flex flex-wrap items-baseline gap-2">
                <span className="stat-number text-3xl leading-none">
                  {wageMetric.format(entry.cnyHour)}
                </span>
                <span className="text-xs">/ 小时</span>
                <span className="text-xs">· 市场汇率折算，不是购买力平价</span>
              </p>
            </div>
          )
        : null}

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {tiles.map(metric => (
          <MetricTile entry={entry} key={metric.key} metric={metric} />
        ))}
      </div>
    </div>
  );
}

function MetricTile({ entry, metric }: { entry: HourlyPowerEntry; metric: HourlyMetric }) {
  const value = metric.get(entry);
  const isMissing = value === null;

  return (
    <div className={cn("rounded-lg border border-border/60 bg-muted/40 p-4", isMissing && "border-dashed")}>
      <p className="eyebrow">
        {METRIC_GROUP_LABEL[metric.group]}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{metric.label}</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className={cn("stat-number text-2xl leading-none", isMissing && "text-muted-foreground")}>
          {isMissing ? DASH : metric.format(value)}
        </span>
        {isMissing ? null : <span className="text-[11px] text-muted-foreground">{metric.unit}</span>}
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        {isMissing ? "该指数未收录此国家" : secondaryLine(entry, metric)}
      </p>
    </div>
  );
}

/**
 * 指标的辅助说明：优先给法定工作周，其次给 8 小时工作日换算
 */
function secondaryLine(entry: HourlyPowerEntry, metric: HourlyMetric): string {
  const value = metric.get(entry);
  const weeks = workWeeks(entry, value);
  if (weeks !== null && entry.statutoryWeeklyHours !== null) {
    return `≈ ${round1(weeks)} 个法定工作周（每周 ${entry.statutoryWeeklyHours} 小时）`;
  }
  if (metric.key === "modelyHours" && entry.modelyDays !== null) {
    return `按每天 8 小时折算约 ${entry.modelyDays} 天`;
  }
  return metric.note;
}
