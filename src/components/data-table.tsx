import type { ColumnDef, ColumnFiltersState, ExpandedState, RowData, SortingState } from "@tanstack/react-table";
import {
  coreFeatures,
  createExpandedRowModel,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_includesString,
  flexRender,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  stockFeatures,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utilities";

/**
 * 全站表格共用 feature 集合：核心 + stock 特性 + 过滤/排序/展开行模型。
 * 行模型工厂必须注册在 `features` 上；作为表选项传入会被忽略（v9 起）。
 * stockFeatures 已含 columnFiltering / globalFiltering，但过滤行模型要自己注册。
 */
const tableFeatureSet = tableFeatures({
  ...coreFeatures,
  ...stockFeatures,
  expandedRowModel: createExpandedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    equals: filterFn_equals,
    equalsString: filterFn_equalsString,
    includesString: filterFn_includesString,
  },
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    text: sortFn_text,
  },
});

export type DataTableColumn<T extends RowData> = ColumnDef<typeof tableFeatureSet, T>;

interface DataTableProperties<T extends RowData> {
  /**
   * 列筛选（区域、覆盖率等）。受控：不传则由表格自管。
   */
  columnFilters?: ColumnFiltersState;
  columns: DataTableColumn<T>[];
  data: T[];
  /**
   * 默认排序，如 `[{ id: "hoursToBuy", desc: false }]`
   */
  defaultSort: SortingState;
  /**
   * 行 id 取值，用于展开状态保持
   */
  getRowId?: (row: T) => string;
  onColumnFiltersChange?: (updater: React.SetStateAction<ColumnFiltersState>) => void;
  /**
   * 展开行的详情内容
   */
  renderExpanded: (row: T) => React.ReactNode;
  /**
   * 表格上方的工具条（搜索、筛选器）
   */
  toolbar?: React.ReactNode;
}

/**
 * 指数数据表：可排序表头 + 可展开行 + 可选筛选。
 * 展开通过行尾真实 button 触发，键盘可达。
 */
export function DataTable<T extends RowData>({
  columnFilters,
  columns,
  data,
  defaultSort,
  getRowId,
  onColumnFiltersChange,
  renderExpanded,
  toolbar,
}: DataTableProperties<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSort);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [innerFilters, setInnerFilters] = React.useState<ColumnFiltersState>([]);
  const filters = columnFilters ?? innerFilters;
  const setFilters = onColumnFiltersChange ?? setInnerFilters;

  const table = useTable({
    columns,
    data,
    features: tableFeatureSet,
    getRowCanExpand: () => true,
    getRowId,
    onColumnFiltersChange: setFilters,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    state: { columnFilters: filters, expanded, sorting },
  });

  const rows = table.getRowModel().rows;

  return (
    <div>
      {toolbar ? <div className="mb-3">{toolbar}</div> : null}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow className="bg-muted/30" key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead className="whitespace-nowrap" colSpan={header.colSpan} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (
                          <Button
                            className={cn(
                              "-ml-3 h-auto p-0 text-muted-foreground hover:text-foreground",
                              header.column.getIsSorted() && "font-semibold text-primary",
                            )}
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
            {rows.length === 0
              ? (
                  <TableRow>
                    <TableCell className="h-24 text-center text-sm text-muted-foreground" colSpan={columns.length + 1}>
                      没有符合当前筛选条件的国家
                    </TableCell>
                  </TableRow>
                )
              : rows.map(row => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell className="whitespace-nowrap" key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          aria-expanded={row.getIsExpanded()}
                          aria-label={row.getIsExpanded() ? "收起详情" : "展开详情"}
                          className="h-7 w-7"
                          onClick={(event) => {
                            event.stopPropagation();
                            row.toggleExpanded();
                          }}
                          size="icon"
                          variant="ghost"
                        >
                          {row.getIsExpanded()
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell className="bg-muted/30 p-4" colSpan={columns.length + 1}>
                          {renderExpanded(row.original)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
          </TableBody>
        </Table>
      </div>
      {rows.length > 0 && rows.length < data.length
        ? (
            <p className="mt-2 text-xs text-muted-foreground">
              当前显示
              {" "}
              {rows.length}
              {" / "}
              {data.length}
              {" 个国家/地区"}
            </p>
          )
        : null}
    </div>
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
