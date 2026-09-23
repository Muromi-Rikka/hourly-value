import { ExternalLink } from "lucide-react";

import type { DataTableColumn } from "@/components/data-table";
import type { BigMacEntry } from "@/data/bigmac";

import { CountryFlag } from "@/components/country-flag";
import { ExploreView } from "@/components/explore-view";
import { BigMacTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { RegionBadge } from "@/components/region-badge";
import { bigmac, BIGMAC_SOURCE } from "@/data/bigmac";
import { cn } from "@/lib/utilities";

const columns: DataTableColumn<BigMacEntry>[] = [
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
    accessorFn: row => row.localPriceFormatted,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        {row.original.localPriceFormatted}
      </span>
    ),
    header: "当地价格",
    id: "localPrice",
  },
  {
    accessorFn: row => row.usdPrice,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        $
        {row.original.usdPrice.toFixed(2)}
      </span>
    ),
    header: "美元价格",
    id: "usdPrice",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.valuationPct,
    cell: ({ row }) => {
      const value = row.original.valuationPct;
      const tone = value > 0 ? "text-green-600" : (value < 0 ? "text-red-600" : "text-muted-foreground");
      return (
        <span className={cn("font-semibold tabular-nums", tone)}>
          {value > 0 ? "+" : ""}
          {value}
          %
        </span>
      );
    },
    header: "估值偏差",
    id: "valuationPct",
    sortFn: "basic",
  },
];

export function BigMacExplore() {
  return (
    <ExploreView
      chart={(
        <RankBarChart
          data={bigmac}
          formatTick={value => `${value}%`}
          formatValue={value => `${value > 0 ? "+" : ""}${value}%`}
          showZeroLine
          tooltip={BigMacTooltip}
          valueKey="valuationPct"
        />
      )}
      chartCaption="全部国家 · 巨无霸估值偏差"
      columns={columns}
      data={bigmac}
      defaultSort={[{ desc: true, id: "valuationPct" }]}
      description={(
        <>
          排序并深入查看
          {bigmac.length}
          {" "}
          个国家/地区的巨无霸指数数据
        </>
      )}
      renderExpanded={row => (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">当地货币</p>
            <p className="text-sm">{row.localCurrency}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">当地价格</p>
            <p className="text-sm">{row.localPriceFormatted}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">美元等值</p>
            <p className="text-sm">
              $
              {row.usdPrice.toFixed(2)}
              {" USD"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">估值偏差</p>
            <p className="text-sm">
              {row.valuationPct > 0 ? "高估 " : (row.valuationPct < 0 ? "低估 " : "持平 ")}
              {row.valuationPct > 0 ? "+" : ""}
              {row.valuationPct}
              %
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">数据来源</p>
            <a
              className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
              href={BIGMAC_SOURCE.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {BIGMAC_SOURCE.name}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>
      )}
      title="巨无霸指数 · 数据探索"
    />
  );
}
