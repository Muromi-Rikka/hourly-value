import { ExternalLink } from "lucide-react";

import type { DataTableColumn } from "@/components/data-table";
import type { CommodityIndexEntry } from "@/data/commodity-index";

import { CountryFlag } from "@/components/country-flag";
import { ExploreView } from "@/components/explore-view";
import { CommodityTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { RegionBadge } from "@/components/region-badge";
import { COMMODITY_SOURCE } from "@/data/commodity";
import { commodityIndex } from "@/data/commodity-index";
import { cnyHour, DASH, hourNumber } from "@/lib/format";

const columns: DataTableColumn<CommodityIndexEntry>[] = [
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
    accessorFn: row => row.basketUSD,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        $
        {row.original.basketUSD.toFixed(2)}
      </span>
    ),
    header: "篮子总价(USD)",
    id: "basketUSD",
  },
  {
    accessorFn: row => row.basketCNY,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        ¥
        {row.original.basketCNY.toFixed(0)}
      </span>
    ),
    header: "篮子总价(CNY)",
    id: "basketCNY",
  },
  {
    accessorFn: row => row.hourlyWage ?? undefined,
    cell: ({ row }) => (
      row.original.hourlyWage === null
        ? <span className="text-muted-foreground">{DASH}</span>
        : (
            <span className="tabular-nums text-muted-foreground">
              {cnyHour(row.original.hourlyWage)}
              /h
            </span>
          )
    ),
    header: "最低时薪",
    id: "hourlyWage",
    sortUndefined: "last",
  },
  {
    accessorFn: row => row.hoursToBuy ?? undefined,
    cell: ({ row }) => (
      row.original.hoursToBuy === null
        ? <span className="text-muted-foreground">{DASH}</span>
        : (
            <span className="font-semibold tabular-nums text-primary">
              {hourNumber(row.original.hoursToBuy)}
              h
            </span>
          )
    ),
    header: "所需工时",
    id: "hoursToBuy",
    sortFn: "basic",
    sortUndefined: "last",
  },
  {
    accessorFn: row => row.commoditySource,
    cell: ({ row }) => (
      <span className="hidden max-w-[200px] truncate text-muted-foreground md:inline">
        {row.original.commoditySource}
      </span>
    ),
    header: "来源",
    id: "source",
  },
];

export function CommodityExplore() {
  return (
    <ExploreView
      chart={(
        <RankBarChart
          data={commodityIndex}
          formatTick={value => `${value}h`}
          formatValue={value => `${value}h`}
          tooltip={CommodityTooltip}
          valueKey="hoursToBuy"
        />
      )}
      chartCaption="全部国家 · 购买物资篮子所需工时"
      columns={columns}
      data={commodityIndex}
      defaultSort={[{ desc: false, id: "hoursToBuy" }]}
      description={(
        <>
          排序并深入查看
          {commodityIndex.length}
          {" "}
          个国家的生活物资篮子购买力数据
        </>
      )}
      renderExpanded={row => (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">物资价格来源</p>
            <a
              className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
              href={COMMODITY_SOURCE.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {row.commoditySource}
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
              : <p className="text-sm text-muted-foreground">该国未收录此项，不参与该指标排行</p>}
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">篮子内容</p>
            <p className="text-sm text-muted-foreground">
              5kg面粉 · 5kg大米 · 1kg食糖 · 1kg食盐 · 2L牛奶 · 24个鸡蛋 · 5L食用油 · 1kg牛肉 · 1kg鸡肉
            </p>
          </div>
        </div>
      )}
      rowLabel={entry => entry.country}
      title="物资篮子数据探索"
    />
  );
}
