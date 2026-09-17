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

import type { BigMacEntry } from "@/data/bigmac";

import { BigMacBarChart } from "@/components/bigmac-bar-chart";
import { CountryFlag } from "@/components/country-flag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bigmac, regions } from "@/data/bigmac";
import { cn } from "@/lib/utilities";

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

const columns: ColumnDef<typeof stockFeatures, BigMacEntry>[] = [
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
    sortingFn: "basic",
  },
  {
    accessorFn: row => row.valuationPct,
    cell: ({ row }) => {
      const v = row.original.valuationPct;
      const color = v > 0 ? "text-green-600" : (v < 0 ? "text-red-600" : "text-muted-foreground");
      return (
        <span className={cn("font-semibold tabular-nums", color)}>
          {v > 0 ? "+" : ""}
          {v}
          %
        </span>
      );
    },
    header: "估值偏差",
    id: "valuationPct",
    sortingFn: "basic",
  },
];

export function BigMacExplore() {
  const [region, setRegion] = React.useState("全部");
  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: true, id: "valuationPct" },
  ]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const data = React.useMemo<BigMacEntry[]>(
    () => (region === "全部" ? bigmac : bigmac.filter(w => w.region === region)),
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
          巨无霸指数 · 数据探索
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          筛选、排序并深入查看
          {" "}
          {bigmac.length}
          {" 个国家/地区的巨无霸指数数据"}
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
                                    <p className="text-xs font-medium text-muted-foreground">当地货币</p>
                                    <p className="text-sm">{row.original.localCurrency}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">当地价格</p>
                                    <p className="text-sm">{row.original.localPriceFormatted}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">美元等值</p>
                                    <p className="text-sm">
                                      $
                                      {row.original.usdPrice.toFixed(2)}
                                      {" USD"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground">估值偏差</p>
                                    <p className="text-sm">
                                      {row.original.valuationPct > 0 ? "高估 " : (row.original.valuationPct < 0 ? "低估 " : "持平 ")}
                                      {row.original.valuationPct > 0 ? "+" : ""}
                                      {row.original.valuationPct}
                                      %
                                    </p>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <p className="text-xs font-medium text-muted-foreground">数据来源</p>
                                    <a
                                      className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
                                      href="https://github.com/TheEconomist/big-mac-data"
                                      onClick={event => event.stopPropagation()}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      The Economist Big Mac Data (GitHub)
                                      <ExternalLink className="h-3 w-3 shrink-0" />
                                    </a>
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
                    {" · 巨无霸估值偏差"}
                  </p>
                  <BigMacBarChart data={data} layout="horizontal" />
                </div>
              )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
