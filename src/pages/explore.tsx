import { ExternalLink } from "lucide-react";

import type { DataTableColumn } from "@/components/data-table";
import type { WageEntry } from "@/data/wages";

import { CountryFlag } from "@/components/country-flag";
import { ExploreView } from "@/components/explore-view";
import { RankBarChart } from "@/components/rank-bar-chart";
import { RegionBadge } from "@/components/region-badge";
import { TooltipShell } from "@/components/tooltip-shell";
import { wages } from "@/data/wages";

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
    header: "本币时薪",
    id: "localWage",
  },
  {
    accessorFn: row => row.cnyEquivalent,
    cell: ({ row }) => (
      <span className="font-semibold tabular-nums text-primary">
        ¥
        {row.original.cnyEquivalent}
      </span>
    ),
    header: "人民币折算",
    id: "cnyEquivalent",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.effectiveDate,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.effectiveDate}</span>
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
      chart={<RankBarChart data={wages} formatTick={value => `¥${value}`} formatValue={value => `¥${value}`} tooltip={WageTooltip} valueKey="cnyEquivalent" />}
      chartCaption="全部国家 · 人民币时薪排名"
      columns={columns}
      data={wages}
      defaultSort={[{ desc: true, id: "cnyEquivalent" }]}
      description={(
        <>
          排序并深入查看
          {wages.length}
          {" "}
          个国家/地区的最低工资数据
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
  const rank = wages.findIndex(item => item.countryCode === entry.countryCode) + 1;

  return (
    <TooltipShell
      country={entry.country}
      countryCode={entry.countryCode}
      note={`${entry.effectiveDate} 生效`}
      rank={rank}
      region={entry.region}
      total={wages.length}
    >
      <p className="text-sm text-muted-foreground">
        {entry.localWage.toLocaleString()}
        {" "}
        {entry.localUnit}
      </p>
      <p className="text-sm font-medium text-primary">
        ≈ ¥
        {entry.cnyEquivalent}
        /小时
      </p>
    </TooltipShell>
  );
}
