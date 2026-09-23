import { ExternalLink } from "lucide-react";

import type { DataTableColumn } from "@/components/data-table";
import type { ModelYIndexEntry } from "@/data/modely-index";

import { CountryFlag } from "@/components/country-flag";
import { ExploreView } from "@/components/explore-view";
import { ModelYTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { RegionBadge } from "@/components/region-badge";
import { modelyIndex } from "@/data/modely-index";

const columns: DataTableColumn<ModelYIndexEntry>[] = [
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
    accessorFn: row => row.modelyPrice,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        ¥
        {row.original.modelyPrice.toLocaleString()}
      </span>
    ),
    header: "Model Y 售价",
    id: "modelyPrice",
  },
  {
    accessorFn: row => row.hourlyWage,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        ¥
        {row.original.hourlyWage}
        /h
      </span>
    ),
    header: "最低时薪",
    id: "hourlyWage",
  },
  {
    accessorFn: row => row.daysToBuy,
    cell: ({ row }) => (
      row.original.daysToBuy === null
        ? <span className="text-muted-foreground">—</span>
        : (
            <span className="font-semibold tabular-nums text-primary">
              {row.original.daysToBuy}
              天
            </span>
          )
    ),
    header: "所需天数",
    id: "daysToBuy",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.hoursToBuy,
    cell: ({ row }) => (
      row.original.hoursToBuy === null
        ? <span className="text-muted-foreground">—</span>
        : (
            <span className="tabular-nums text-muted-foreground">
              {row.original.hoursToBuy}
              h
            </span>
          )
    ),
    header: "所需工时",
    id: "hoursToBuy",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.taxNote,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.taxNote}</span>
    ),
    header: "税费说明",
    id: "taxNote",
  },
  {
    accessorFn: row => row.modelySource,
    cell: ({ row }) => (
      <span className="hidden max-w-[200px] truncate text-muted-foreground md:inline">
        {row.original.modelySource}
      </span>
    ),
    header: "来源",
    id: "source",
  },
];

export function ModelYExplore() {
  const chartData = modelyIndex.filter(item => item.daysToBuy !== null);

  return (
    <ExploreView
      chart={(
        <RankBarChart
          data={chartData}
          formatTick={value => `${value}天`}
          formatValue={value => `${value}天`}
          tooltip={ModelYTooltip}
          valueKey="daysToBuy"
        />
      )}
      chartCaption="全部国家 · 购买 Model Y 所需工作天数"
      columns={columns}
      data={modelyIndex}
      defaultSort={[{ desc: false, id: "daysToBuy" }]}
      description={(
        <>
          排序并深入查看
          {modelyIndex.length}
          {" "}
          个国家/地区的 Tesla Model Y 购买力数据
        </>
      )}
      renderExpanded={row => (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Model Y 价格来源</p>
            <a
              className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
              href={row.modelySourceUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {row.modelySource}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">工资数据来源</p>
            {row.wageSource
              ? (
                  <a
                    className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
                    href={row.wageSourceUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {row.wageSource}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                )
              : <p className="text-sm text-muted-foreground">暂无数据</p>}
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">税费说明</p>
            <p className="text-sm">{row.taxNote}</p>
          </div>
        </div>
      )}
      title="Model Y 数据探索"
    />
  );
}
