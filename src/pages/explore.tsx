import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  coreFeatures,
  createExpandedRowModel,
  createSortedRowModel,
  flexRender,
  stockFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import * as React from "react";

import type { WageEntry } from "@/data/wages";

import { CountryFlag } from "@/components/country-flag";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { BlurText } from "@/components/react-bits/BlurText/BlurText";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WageBarChart } from "@/components/wage-bar-chart";
import { wages } from "@/data/wages";

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

const columns: ColumnDef<typeof stockFeatures, WageEntry>[] = [
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
    sortingFn: "basic",
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
  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: true, id: "cnyEquivalent" },
  ]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const table = useTable({
    columns,
    data: wages,
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
        <BlurText
          animateBy="words"
          className="font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.1] tracking-[-0.02em]"
          delay={150}
          text="数据探索"
        />
        <AnimatedContent delay={0.1} distance={20} duration={0.5}>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
            排序并深入查看
            {" "}
            {wages.length}
            {" 个国家/地区的最低工资数据"}
          </p>
        </AnimatedContent>
      </div>

      {/* Views */}
      <AnimatedContent delay={0.1} distance={40} duration={0.6} threshold={0.05}>
        <Tabs defaultValue="table">
          <TabsList className="mt-4">
            <TabsTrigger value="table">表格视图</TabsTrigger>
            <TabsTrigger value="chart">图表视图</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-4" value="table">
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
                                <p className="text-xs font-medium text-muted-foreground">来源机构</p>
                                <p className="text-sm">{row.original.source}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">来源链接</p>
                                <a
                                  className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
                                  href={row.original.sourceUrl}
                                  onClick={event => event.stopPropagation()}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {row.original.sourceUrl}
                                  <ExternalLink className="h-3 w-3 shrink-0" />
                                </a>
                              </div>
                              <div className="sm:col-span-2">
                                <p className="text-xs font-medium text-muted-foreground">备注</p>
                                <p className="text-sm">{row.original.note}</p>
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
          </TabsContent>

          <TabsContent className="mt-4" value="chart">
            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                全部国家 · 人民币时薪排名
              </p>
              <WageBarChart data={wages} layout="horizontal" />
            </div>
          </TabsContent>
        </Tabs>
      </AnimatedContent>
    </div>
  );
}
