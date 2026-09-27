import { ExternalLink } from "lucide-react";
import * as React from "react";

import type { DataTableColumn } from "@/components/data-table";
import type { IPhoneIndexEntry } from "@/data/iphone-index";

import { CountryFlag } from "@/components/country-flag";
import { ExploreView } from "@/components/explore-view";
import { createIPhoneTooltip } from "@/components/index-tooltips";
import { RankBarChart } from "@/components/rank-bar-chart";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { RegionBadge } from "@/components/region-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { iphoneDuoIndex } from "@/data/iphone-duo-index";
import { iphoneIndex } from "@/data/iphone-index";

type ModelKey = "duo" | "pro18";

const MODEL_DATA: Record<ModelKey, { data: IPhoneIndexEntry[]; label: string }> = {
  duo: { data: iphoneDuoIndex, label: "iPhone Duo" },
  pro18: { data: iphoneIndex, label: "iPhone 18 Pro" },
};

const columns: DataTableColumn<IPhoneIndexEntry>[] = [
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
    accessorFn: row => row.iphonePrice,
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">
        ¥
        {row.original.iphonePrice.toLocaleString()}
      </span>
    ),
    header: "iPhone 售价",
    id: "iphonePrice",
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
    accessorFn: row => row.hoursToBuy,
    cell: ({ row }) => (
      row.original.hoursToBuy === null
        ? <span className="text-muted-foreground">—</span>
        : (
            <span className="font-semibold tabular-nums text-primary">
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
    accessorFn: row => row.iphoneSource,
    cell: ({ row }) => (
      <span className="hidden max-w-[200px] truncate text-muted-foreground md:inline">
        {row.original.iphoneSource}
      </span>
    ),
    header: "来源",
    id: "source",
  },
];

export function IPhoneExplore() {
  const [model, setModel] = React.useState<ModelKey>("pro18");
  const activeData = MODEL_DATA[model].data;
  const activeLabel = MODEL_DATA[model].label;
  const chartData = activeData.filter(item => item.hoursToBuy !== null);

  return (
    <div>
      <AnimatedContent delay={0.15} distance={20} duration={0.5}>
        <Tabs className="pb-4" onValueChange={value => setModel(value as ModelKey)} value={model}>
          <TabsList>
            <TabsTrigger value="pro18">iPhone 18 Pro</TabsTrigger>
            <TabsTrigger value="duo">iPhone Duo</TabsTrigger>
          </TabsList>
        </Tabs>
      </AnimatedContent>

      <ExploreView
        chart={(
          <RankBarChart
            data={chartData}
            formatTick={value => `${value}h`}
            formatValue={value => `${value}h`}
            tooltip={createIPhoneTooltip(chartData)}
            valueKey="hoursToBuy"
          />
        )}
        chartCaption={(
          <>
            全部国家 · 购买
            {activeLabel}
            {" "}
            所需工时
          </>
        )}
        columns={columns}
        data={activeData}
        defaultSort={[{ desc: false, id: "hoursToBuy" }]}
        description={(
          <>
            排序并深入查看
            {activeData.length}
            {" "}
            个国家/地区的
            {activeLabel}
            {" "}
            购买力数据
          </>
        )}
        getRowId={entry => entry.countryCode}
        key={model}
        renderExpanded={row => (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">iPhone 价格来源</p>
              <a
                className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
                href={row.iphoneSourceUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {row.iphoneSource}
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
              <p className="text-xs font-medium text-muted-foreground">税费说明</p>
              <p className="text-sm">{row.taxNote}</p>
            </div>
          </div>
        )}
        title="iPhone 数据探索"
      />
    </div>
  );
}
