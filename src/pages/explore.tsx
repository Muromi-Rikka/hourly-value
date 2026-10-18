import { useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import * as React from "react";

import type { DataTableColumn } from "@/components/data-table";
import type { WageCaliber, WageEntry } from "@/data/wages";

import { CaliberSwitcher } from "@/components/caliber-switcher";
import { CountryFlag } from "@/components/country-flag";
import { ExploreView } from "@/components/explore-view";
import { RankBarChart } from "@/components/rank-bar-chart";
import { RegionBadge } from "@/components/region-badge";
import { TooltipShell } from "@/components/tooltip-shell";
import { basisLabel, CALIBER_LABEL, CALIBER_NOTE, monthlyBasisLabel, wages } from "@/data/wages";
import { cny, cnyHour, dateOnly, localAmount } from "@/lib/format";
import { cn } from "@/lib/utilities";
import { exploreRoute } from "@/routes/explore";

export function Explore() {
  const search = exploreRoute.useSearch();
  const navigate = useNavigate({ from: exploreRoute.fullPath });
  const caliber: WageCaliber = search.caliber === "monthly" ? "monthly" : "hourly";
  const valueKey = caliber === "monthly" ? "cnyHourFromMonthly" : "cnyEquivalent";

  const columns = React.useMemo(() => createColumns(caliber), [caliber]);
  const ranked = React.useMemo(
    () => wages.toSorted((a, b) => (b[valueKey] ?? 0) - (a[valueKey] ?? 0)),
    [valueKey],
  );
  // 稳定引用：每次渲染新建 tooltip 组件会让 Recharts 反复卸载重挂
  const WageTooltip = React.useMemo(() => createWageTooltip(ranked), [ranked]);

  return (
    <ExploreView
      chart={(
        <RankBarChart
          data={wages}
          formatTick={value => `¥${Math.round(value)}`}
          formatValue={value => cnyHour(value)}
          tooltip={WageTooltip}
          valueKey={valueKey}
        />
      )}
      chartCaption={`全部国家 · ${CALIBER_LABEL[caliber]}人民币时薪排名（税前法定最低工资，按市场汇率折算）`}
      columns={columns}
      data={wages}
      defaultSort={[{ desc: true, id: valueKey }]}
      description={(
        <>
          排序并深入查看
          {" "}
          {wages.length}
          {" 个国家/地区的最低工资数据。两种工资口径并排列出，展开任意一行可看工时折算口径、是否代理值与三组官方来源。"}
        </>
      )}
      headerExtra={(
        <div className="flex flex-wrap items-center gap-3">
          <CaliberSwitcher
            onChange={next => void navigate({ search: { caliber: next === "monthly" ? "monthly" : undefined } })}
            value={caliber}
          />
          <span className="max-w-prose text-xs text-muted-foreground">{CALIBER_NOTE[caliber]}</span>
        </div>
      )}
      renderExpanded={row => <WageDetail entry={row} />}
      rowLabel={entry => entry.country}
      tableKey={caliber}
      title="数据探索"
    />
  );
}

/**
 * 两种工资口径的人民币时薪列并排列出，切换器只决定图表与默认排序读哪一列。
 */
function createColumns(caliber: WageCaliber): DataTableColumn<WageEntry>[] {
  return [
    {
      accessorFn: row => row.country,
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 font-medium">
          <CountryFlag className="h-4 w-4" countryCode={row.original.countryCode} />
          {row.original.country}
        </span>
      ),
      header: "国家",
      id: "country",
    },
    {
      accessorFn: row => row.region,
      cell: ({ row }) => <RegionBadge region={row.original.region} />,
      header: "区域",
      id: "region",
    },
    {
      accessorFn: row => row.localWage,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {localAmount(row.original.localWage, row.original.localUnit)}
        </span>
      ),
      header: "本币时薪",
      id: "localWage",
    },
    {
      accessorFn: row => row.cnyEquivalent,
      cell: ({ row }) => (
        <span className={cn("tabular-nums", caliber === "hourly" ? "font-semibold text-primary" : "text-muted-foreground")}>
          {cnyHour(row.original.cnyEquivalent)}
        </span>
      ),
      header: CALIBER_LABEL.hourly,
      id: "cnyEquivalent",
      sortFn: "basic",
    },
    {
      accessorFn: row => row.cnyHourFromMonthly,
      cell: ({ row }) => (
        <span className={cn("tabular-nums", caliber === "monthly" ? "font-semibold text-primary" : "text-muted-foreground")}>
          {cnyHour(row.original.cnyHourFromMonthly)}
        </span>
      ),
      header: CALIBER_LABEL.monthly,
      id: "cnyHourFromMonthly",
      sortFn: "basic",
    },
    {
      accessorFn: row => row.localMonthly,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {localAmount(row.original.localMonthly, row.original.localMonthlyUnit)}
        </span>
      ),
      header: "本币月薪",
      id: "localMonthly",
    },
    {
      accessorFn: row => row.cnyMonthly,
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">{cny(row.original.cnyMonthly)}</span>
      ),
      header: "人民币月薪",
      id: "cnyMonthly",
      sortFn: "basic",
    },
    {
      accessorFn: row => row.effectiveDate,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{dateOnly(row.original.effectiveDate)}</span>
      ),
      header: "生效日期",
      id: "effectiveDate",
    },
  ];
}

function createWageTooltip(ranked: WageEntry[]) {
  return function WageTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: WageEntry }> }) {
    const entry = payload?.[0]?.payload;
    if (!active || !entry) {
      return null;
    }
    const rank = ranked.findIndex(item => item.countryCode === entry.countryCode) + 1;

    return (
      <TooltipShell
        country={entry.country}
        countryCode={entry.countryCode}
        note={`${entry.effectiveDate} 生效`}
        rank={rank}
        region={entry.region}
        total={ranked.length}
      >
        <p className="text-sm text-muted-foreground">
          时薪口径
          {" "}
          {cnyHour(entry.cnyEquivalent)}
          {" · 月薪口径 "}
          {cnyHour(entry.cnyHourFromMonthly)}
        </p>
        <p className="text-sm font-medium text-primary">
          {localAmount(entry.localWage, entry.localUnit)}
        </p>
        <p className="text-sm text-muted-foreground">
          月薪
          {" "}
          {localAmount(entry.localMonthly, entry.localMonthlyUnit)}
        </p>
      </TooltipShell>
    );
  };
}

function SourceLine({ label, source, url }: { label: string; source: string; url: string }) {
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">
        {label}
        ：
      </span>
      <a
        className="inline-flex items-center gap-1 break-all text-primary underline underline-offset-2"
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {source}
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    </p>
  );
}

function WageDetail({ entry }: { entry: WageEntry }) {
  return (
    <div className="border-l-2 border-primary/30 pl-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">时薪折算口径</p>
          <p className="text-sm">{basisLabel(entry.hoursBasis, entry.statutoryHours)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {localAmount(entry.localWage, entry.localUnit)}
            {" = "}
            {cnyHour(entry.cnyEquivalent)}
            /小时
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">月薪折算口径</p>
          <p className="text-sm">{monthlyBasisLabel(entry)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {localAmount(entry.localMonthly, entry.localMonthlyUnit)}
            {" = "}
            {cnyHour(entry.cnyHourFromMonthly)}
            /小时（人民币）
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">数据性质</p>
          <p className={cn("text-sm", entry.isProxy && "text-primary")}>
            {entry.isProxy ? "代理值（地区中位数或集体协议口径）" : "全国统一法定标准"}
          </p>
        </div>
        <div className="space-y-1 sm:col-span-2 lg:col-span-3">
          <p className="text-xs font-medium text-muted-foreground">数据来源</p>
          <SourceLine label="时薪" source={entry.source} url={entry.sourceUrl} />
          <SourceLine
            label={entry.monthlyWageIsDerived ? "月薪（推算）" : "月薪"}
            source={entry.monthlySource}
            url={entry.monthlySourceUrl}
          />
          <SourceLine label="法定周工时" source={entry.weeklyHoursSource} url={entry.weeklyHoursSourceUrl} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="text-xs font-medium text-muted-foreground">备注</p>
          <p className="text-sm">{entry.note}</p>
        </div>
      </div>
    </div>
  );
}
