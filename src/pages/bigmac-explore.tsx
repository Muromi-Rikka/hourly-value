import { ExternalLink } from "lucide-react";

import type { DataTableColumn } from "@/components/data-table";
import type { BigMacEntry } from "@/data/bigmac";

import { CountryFlag } from "@/components/country-flag";
import { ExploreView } from "@/components/explore-view";
import { BigMacTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { RegionBadge } from "@/components/region-badge";
import { bigmac, BIGMAC_SOURCE } from "@/data/bigmac";
import { sortedByBigMacPerHour } from "@/data/bigmac-ppp";
import { bigMacCount, dateOnly, percent } from "@/lib/format";
import { cn } from "@/lib/utilities";

/**
 * 估值表与购买力表的联结行：一行同时给出货币估值与「一小时能买几个」。
 */
type Row = BigMacEntry & { bigMacPerHour: null | number };

const perHourByCode = new Map(sortedByBigMacPerHour.map(entry => [entry.countryCode, entry.bigMacPerHour]));

const rows: Row[] = bigmac.map(entry => ({
  ...entry,
  bigMacPerHour: perHourByCode.get(entry.countryCode) ?? null,
}));

const columns: DataTableColumn<Row>[] = [
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
    accessorFn: row => row.bigMacPerHour ?? undefined,
    cell: ({ row }) => (
      <span className="font-semibold tabular-nums text-primary">
        {bigMacCount(row.original.bigMacPerHour)}
      </span>
    ),
    header: "1 小时能买巨无霸",
    id: "bigMacPerHour",
    sortFn: "basic",
    sortUndefined: "last",
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
          {percent(value)}
        </span>
      );
    },
    header: "估值偏差",
    id: "valuationPct",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.dataDate,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {dateOnly(row.original.dataDate)}
      </span>
    ),
    header: "价格日期",
    id: "dataDate",
  },
];

export function BigMacExplore() {
  return (
    <ExploreView
      chart={(
        <RankBarChart
          data={bigmac}
          formatTick={value => `${value}%`}
          formatValue={value => percent(value)}
          showZeroLine
          tooltip={BigMacTooltip}
          valueKey="valuationPct"
        />
      )}
      chartCaption="全部国家 · 巨无霸估值偏差（对照美元汇率，非最低工资购买力）"
      columns={columns}
      data={rows}
      defaultSort={[{ desc: true, id: "bigMacPerHour" }]}
      description={(
        <>
          默认按「1 小时能买几个巨无霸」排序 —— 这是全程本币相除、不过汇率的购买力指标；
          估值偏差与美元价格作为对照。9 个欧元区国家采用 Euro area 汇总行，见「价格日期」列。
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
            <p className="text-xs font-medium text-muted-foreground">1 小时能买</p>
            <p className="text-sm text-primary">{bigMacCount(row.bigMacPerHour)}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">当地最低时薪 ÷ 当地售价，不过汇率</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">美元等值与估值偏差</p>
            <p className="text-sm">
              $
              {row.usdPrice.toFixed(2)}
              {" USD · "}
              {row.valuationPct > 0 ? "高估 " : (row.valuationPct < 0 ? "低估 " : "持平 ")}
              {percent(row.valuationPct)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">价格日期</p>
            <p className="text-sm">{row.dataDate}</p>
          </div>
          <div>
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
      rowLabel={entry => entry.country}
      title="巨无霸指数 · 数据探索"
    />
  );
}
