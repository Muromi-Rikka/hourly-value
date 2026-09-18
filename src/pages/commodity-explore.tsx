import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  coreFeatures,
  createExpandedRowModel,
  createSortedRowModel,
  flexRender,
  stockFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp, ExternalLink, Inbox } from "lucide-react";
import * as React from "react";

import type { CommodityIndexEntry } from "@/data/commodity-index";

import { CommodityBarChart } from "@/components/commodity-bar-chart";
import { CountryFlag } from "@/components/country-flag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { commodityIndex, regions } from "@/data/commodity-index";

function regionBg(region: string): string {
  if (region === "北美") {
    return "var(--color-region-north-america)";
  }
  if (region === "亚洲") {
    return "var(--color-region-asia)";
  }
  if (region === "欧洲") {
    return "var(--color-region-europe)";
  }
  return "var(--color-region-oceania)";
}

function sortIcon(direction: "asc" | "desc" | false, canSort: boolean) {
  if (direction === "asc") {
    return <ChevronUp className="ml-1 h-3 w-3" />;
  }
  if (direction === "desc") {
    return <ChevronDown className="ml-1 h-3 w-3" />;
  }
  if (canSort) {
    return <ArrowUpDown className="ml-1 h-3 w-3" />;
  }
  return null;
}

const columns: ColumnDef<typeof stockFeatures, CommodityIndexEntry>[] = [
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
    cell: ({ row }) => (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
        style={{ background: regionBg(row.original.region) }}
      >
        {row.original.region}
      </span>
    ),
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
      <span className="font-semibold tabular-nums text-primary">
        {row.original.hoursToBuy}
        h
      </span>
    ),
    header: "所需工时",
    id: "hoursToBuy",
    sortingFn: "basic",
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
  const [region, setRegion] = React.useState("全部");
  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: false, id: "hoursToBuy" },
  ]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const data = React.useMemo<CommodityIndexEntry[]>(
    () => (region === "全部" ? commodityIndex : commodityIndex.filter(w => w.region === region)),
    [region],
  );

  const table = useTable({
    columns,
    data,
    features: { ...coreFeatures, ...stockFeatures },
    getExpandedRowModel: createExpandedRowModel(),
    getRowCanExpand: () => true,
    getSortedRowModel: createSortedRowModel(),
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    state: { expanded, sorting },
  });

  return (
    <div>
      {/* Header */}
      <div className="pb-6">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.1] tracking-[-0.02em]">
          物资篮子数据探索
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          筛选、排序并深入查看
          {" "}
          {commodityIndex.length}
          {" 个国家的生活物资篮子购买力数据"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 border-b pb-4">
        <Select onValueChange={setRegion} value={region}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="按地区筛选" />
          </SelectTrigger>
          <SelectContent>
            {regions.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge className="ml-auto" variant="secondary">
          {table.getRowModel().rows.length}
          {" 条记录"}
        </Badge>
      </div>

      {/* Views */}
      <Tabs defaultValue="table">
        <TabsList className="mt-4">
          <TabsTrigger value="table">表格视图</TabsTrigger>
          <TabsTrigger value="chart">图表视图</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-4" value="table">
          {data.length === 0
            ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Inbox className="mb-3 h-8 w-8" />
                  <p className="text-sm">该区域暂无数据</p>
                </div>
              )
            : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <TableHead colSpan={header.colSpan} key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : (
                                    <Button
                                      className="-ml-3 h-auto p-0 text-muted-foreground hover:text-foreground"
                                      disabled={!header.column.getCanSort()}
                                      onClick={header.column.getToggleSortingHandler()}
                                      variant="ghost"
                                    >
                                      {flexRender(header.column.columnDef.header, header.getContext())}
                                      {sortIcon(header.column.getIsSorted(), header.column.getCanSort())}
                                    </Button>
                                  )}
                            </TableHead>
                          ))}
                          <TableHead className="w-8" />
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.map(row => (
                        <React.Fragment key={row.id}>
                          <TableRow
                            className="cursor-pointer transition-colors hover:bg-muted/50"
                            onClick={() => row.toggleExpanded()}
                          >
                            {row.getVisibleCells().map(cell => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                            <TableCell>
                              {row.getIsExpanded()
                                ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                            </TableCell>
                          </TableRow>
                          {row.getIsExpanded() && (
                            <TableRow>
                              <TableCell className="bg-muted/30 p-4" colSpan={columns.length + 1}>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">物资价格来源</p>
                                    <a
                                      className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
                                      href="https://www.globalproductprices.com/indicators_list.php"
                                      onClick={event => event.stopPropagation()}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {row.original.commoditySource}
                                      <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">工资数据来源</p>
                                    {row.original.wageSource
                                      ? (
                                          <a
                                            className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
                                            href={row.original.wageSourceUrl}
                                            onClick={event => event.stopPropagation()}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                          >
                                            {row.original.wageSource}
                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                          </a>
                                        )
                                      : <p className="text-sm text-muted-foreground">暂无数据</p>}
                                  </div>
                                  <div className="sm:col-span-2">
                                    <p className="text-xs font-medium text-muted-foreground">篮子内容</p>
                                    <p className="text-sm text-muted-foreground">
                                      5kg面粉 · 5kg大米 · 1kg食糖 · 1kg食盐 · 2L牛奶 · 24个鸡蛋 · 5L食用油 · 1kg牛肉 · 1kg鸡肉
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
        </TabsContent>

        <TabsContent className="mt-4" value="chart">
          {data.length === 0
            ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Inbox className="mb-3 h-8 w-8" />
                  <p className="text-sm">该区域暂无数据</p>
                </div>
              )
            : (
                <div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {region === "全部" ? "全部国家" : region}
                    {" · 购买物资篮子所需工时"}
                  </p>
                  <CommodityBarChart data={data} layout="horizontal" />
                </div>
              )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
