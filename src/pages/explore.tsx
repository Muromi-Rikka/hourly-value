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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WageBarChart } from "@/components/wage-bar-chart";
import { regions, wages } from "@/data/wages";

function countryFlag(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(c => 127_397 + c.codePointAt(0)!),
  );
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
      <span className="font-medium">
        {countryFlag(row.original.countryCode)}
        {" "}
        {row.original.country}
      </span>
    ),
    header: "国家",
    id: "country",
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
      <span className="font-semibold text-primary">
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
      <span className="hidden md:inline max-w-[200px] truncate text-muted-foreground">
        {row.original.source}
      </span>
    ),
    header: "来源",
    id: "source",
  },
  {
    accessorFn: row => row.note,
    cell: ({ row }) => (
      <span className="hidden lg:inline max-w-[200px] truncate text-muted-foreground">
        {row.original.note}
      </span>
    ),
    header: "备注",
    id: "note",
  },
];

export function Explore() {
  const [region, setRegion] = React.useState("全部");
  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: true, id: "cnyEquivalent" },
  ]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const data = React.useMemo<WageEntry[]>(
    () => (region === "全部" ? wages : wages.filter(w => w.region === region)),
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
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-normal tracking-tight sm:text-3xl">数据探索</h1>
        <p className="text-sm text-muted-foreground">
          筛选、排序并深入查看
          {" "}
          {wages.length}
          {" "}
          个国家/地区的最低工资数据
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
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
          {" "}
          条记录
        </Badge>
      </div>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">表格视图</TabsTrigger>
          <TabsTrigger value="chart">图表视图</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
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
                        className="cursor-pointer"
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
                          <TableCell className="bg-muted/50 p-4" colSpan={columns.length + 1}>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">来源机构</p>
                                <p className="text-sm">{row.original.source}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">来源链接</p>
                                <a
                                  className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-2 break-all"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {region === "全部" ? "全部国家" : region}
                {" · 人民币时薪排名"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WageBarChart data={data} layout="horizontal" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
