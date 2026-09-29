import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, Link2 } from "lucide-react";
import type { HourlyMetric, HourlyPowerEntry, MetricGroup } from "@/data/hourly-power";

import { CountryFlag } from "@/components/country-flag";
import { CountrySelect } from "@/components/country-select";
import { Button } from "@/components/ui/button";
import { cardVariants } from "@/components/ui/card";
import { comparePair, METRIC_GROUP_LABEL, verdictOf } from "@/data/hourly-power";
import { DASH, ratio as formatRatio } from "@/lib/format";
import { cn } from "@/lib/utilities";

interface HourlyCompareProperties {
  a: HourlyPowerEntry;
  b: HourlyPowerEntry;
  className?: string;
  /**
   * 只保留指标与数值，不显示口径行（首页精简版用）
   */
  compact?: boolean;
  onChange: (side: "a" | "b", countryCode: string) => void;
  onSwap: () => void;
  options: HourlyPowerEntry[];
  /**
   * 可分享的当前对比链接
   */
  shareHref?: string;
}

const GROUP_ORDER: MetricGroup[] = ["wage", "food", "goods", "car"];

interface CompareRowProperties {
  a: HourlyPowerEntry;
  b: HourlyPowerEntry;
  compact: boolean;
  metric: HourlyMetric;
  ratio: null | number;
  valueA: null | number;
  valueB: null | number;
}

/**
 * 「一小时对一小时」：两个国家逐指标对比。
 * 受控组件 —— URL 状态由页面自己管，首页可用本地 state。
 */
export function HourlyCompare({
  a,
  b,
  className,
  compact = false,
  onChange,
  onSwap,
  options,
  shareHref,
}: HourlyCompareProperties) {
  const rows = comparePair(a, b);
  const verdict = verdictOf(rows);

  return (
    <div className={cn(cardVariants({ variant: "raised" }), "p-5 sm:p-6", className)}>
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <CountrySelect id="compare-a" label="国家 A" onChange={code => onChange("a", code)} options={options} value={a.countryCode} />
        <Button
          aria-label="交换两个国家"
          className="mb-0.5 hidden sm:inline-flex"
          onClick={onSwap}
          size="icon"
          variant="outline"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <CountrySelect id="compare-b" label="国家 B" onChange={code => onChange("b", code)} options={options} value={b.countryCode} />
      </div>

      <Button className="mt-3 w-full sm:hidden" onClick={onSwap} size="sm" variant="outline">
        <ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" />
        交换两个国家
      </Button>

      <div className="mt-5 space-y-4 border-t pt-4">
        <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4">
          <p className="eyebrow">指标</p>
          <CountryTag country={a} />
          <CountryTag country={b} />
          <p className="eyebrow hidden w-24 text-right sm:block">差距</p>
        </div>

        {GROUP_ORDER.map((group) => {
          const groupRows = rows.filter(row => row.metric.group === group);
          if (groupRows.length === 0) {
            return null;
          }
          return (
            <div key={group}>
              <p className="eyebrow mb-1">
                {METRIC_GROUP_LABEL[group]}
              </p>
              <div className="divide-y">
                {groupRows.map(row => (
                  <CompareRow
                    a={a}
                    b={b}
                    compact={compact}
                    key={row.metric.key}
                    metric={row.metric}
                    ratio={row.ratio}
                    valueA={row.valueA}
                    valueB={row.valueB}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {verdict
        ? (
            <p className="mt-5 rounded-lg border border-primary/20 bg-primary/6 px-4 py-3 text-sm leading-relaxed">
              {verdict}
            </p>
          )
        : null}

      {shareHref
        ? (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span>这个对比可以直接分享：</span>
              <Link className="truncate text-primary underline underline-offset-2" to={shareHref}>
                {shareHref}
              </Link>
            </p>
          )
        : null}
    </div>
  );
}

function CompareRow({ a, b, compact, metric, ratio, valueA, valueB }: CompareRowProperties) {
  const isALeads = ratio !== null && ratio >= 1;
  const lead = ratio === null ? null : (isALeads ? ratio : 1 / ratio);
  const leaderName = isALeads ? a.country : b.country;

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-baseline gap-3 py-2 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4">
      <div className="min-w-0">
        <p className="truncate text-sm">{metric.label}</p>
        {compact ? null : <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{metric.note}</p>}
      </div>
      <p className="stat-number w-20 text-right text-base whitespace-nowrap sm:w-24">
        {/* 归属只靠表头 CountryTag 的视觉对齐；线性朗读时两个裸数字分不出谁是谁 */}
        <span className="sr-only">
          {a.country}
          ：
        </span>
        <span className={cn("inline-block rounded px-1.5 py-0.5", isALeads ? "bg-primary/10 text-primary" : "text-muted-foreground")}>
          {valueA === null ? DASH : metric.format(valueA)}
        </span>
      </p>
      <p className="stat-number w-20 text-right text-base whitespace-nowrap sm:w-24">
        <span className="sr-only">
          {b.country}
          ：
        </span>
        <span className={cn("inline-block rounded px-1.5 py-0.5", !isALeads && lead !== null ? "bg-primary/10 text-primary" : "text-muted-foreground")}>
          {valueB === null ? DASH : metric.format(valueB)}
        </span>
      </p>
      <p className="hidden w-24 text-right text-xs whitespace-nowrap text-muted-foreground sm:block">
        {lead === null
          ? DASH
          : (
              <>
                <span className="stat-number text-sm text-foreground">{formatRatio(lead)}</span>
                {" "}
                {leaderName}
              </>
            )}
      </p>
    </div>
  );
}

function CountryTag({ country }: { country: HourlyPowerEntry }) {
  return (
    <p className="flex w-20 items-center justify-end gap-1 text-[11px] text-muted-foreground sm:w-24">
      <span className="truncate">{country.country}</span>
      <CountryFlag className="h-4 w-4 shrink-0" countryCode={country.countryCode} />
    </p>
  );
}
