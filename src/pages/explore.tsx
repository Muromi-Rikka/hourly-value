import { ExternalLink } from "lucide-react";

import type { DataTableColumn } from "@/components/data-table";
import type { HoursBasis, WageEntry } from "@/data/wages";

import { CountryFlag } from "@/components/country-flag";
import { ExploreView } from "@/components/explore-view";
import { RankBarChart } from "@/components/rank-bar-chart";
import { RegionBadge } from "@/components/region-badge";
import { TooltipShell } from "@/components/tooltip-shell";
import { sortedByWage, wages } from "@/data/wages";
import { cnyHour, dateOnly } from "@/lib/format";
import { cn } from "@/lib/utilities";

/**
 * 工资公布单位 → 中文口径说明
 */
function basisLabel(basis: HoursBasis, statutoryHours: null | number): string {
  switch (basis) {
    case "day": {
      return `按日薪折算（每天 ${statutoryHours ?? "—"} 小时）`;
    }
    case "hour": {
      return "官方直接公布时薪";
    }
    case "month": {
      return `按月薪折算（每月 ${statutoryHours ?? "—"} 小时）`;
    }
    case "week": {
      return `按周薪折算（每周 ${statutoryHours ?? "—"} 小时）`;
    }
  }
}

const columns: DataTableColumn<WageEntry>[] = [
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
        {row.original.localWage.toLocaleString()}
        {" "}
        {row.original.localUnit}
      </span>
    ),
    header: "本币时薪（税前法定）",
    id: "localWage",
  },
  {
    accessorFn: row => row.cnyEquivalent,
    cell: ({ row }) => (
      <span className="font-semibold tabular-nums text-primary">
        {cnyHour(row.original.cnyEquivalent)}
      </span>
    ),
    header: "人民币折算",
    id: "cnyEquivalent",
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
  {
    accessorFn: row => row.source,
    cell: ({ row }) => (
      <span className="hidden max-w-[200px] truncate text-muted-foreground md:inline">
        {row.original.source}
      </span>
    ),
    header: "来源",
    id: "source",
  },
];

export function Explore() {
  return (
    <ExploreView
      chart={<RankBarChart data={wages} formatTick={value => `¥${Math.round(value)}`} formatValue={value => cnyHour(value)} tooltip={WageTooltip} valueKey="cnyEquivalent" />}
      chartCaption="全部国家 · 人民币时薪排名（税前法定最低工资，按市场汇率折算）"
      columns={columns}
      data={wages}
      defaultSort={[{ desc: true, id: "cnyEquivalent" }]}
      description={(
        <>
          排序并深入查看
          {" "}
          {wages.length}
          {" 个国家/地区的最低工资数据。展开任意一行可看工时折算口径、是否代理值与官方来源。"}
        </>
      )}
      renderExpanded={row => (
        <div className="border-l-2 border-primary/30 pl-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">来源机构</p>
              <p className="text-sm">{row.source}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">工时折算口径</p>
              <p className="text-sm">{basisLabel(row.hoursBasis, row.statutoryHours)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {row.statutoryWeeklyHours === null
                  ? "来源未明确法定周工时，不做外推"
                  : `法定每周 ${row.statutoryWeeklyHours} 小时`}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">数据性质</p>
              <p className={cn("text-sm", row.isProxy && "text-primary")}>
                {row.isProxy ? "代理值（地区中位数或集体协议口径）" : "全国统一法定标准"}
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium text-muted-foreground">来源链接</p>
              <a
                className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
                href={row.sourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {row.sourceUrl}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium text-muted-foreground">备注</p>
              <p className="text-sm">{row.note}</p>
            </div>
          </div>
        </div>
      )}
      title="数据探索"
    />
  );
}

function WageTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: WageEntry }> }) {
  const entry = payload?.[0]?.payload;
  if (!active || !entry) {
    return null;
  }
  const rank = sortedByWage.findIndex(item => item.countryCode === entry.countryCode) + 1;

  return (
    <TooltipShell
      country={entry.country}
      countryCode={entry.countryCode}
      note={`${entry.effectiveDate} 生效`}
      rank={rank}
      region={entry.region}
      total={sortedByWage.length}
    >
      <p className="text-sm text-muted-foreground">
        {entry.localWage.toLocaleString()}
        {" "}
        {entry.localUnit}
      </p>
      <p className="text-sm font-medium text-primary">
        ≈
        {" "}
        {cnyHour(entry.cnyEquivalent)}
        /小时
      </p>
    </TooltipShell>
  );
}
