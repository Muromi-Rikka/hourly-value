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
  /**
   * 空状态时展示的「清除筛选」回调；不传则不渲染按钮
   */
  onClearFilters?: () => void;
  onColumnFiltersChange?: (updater: React.SetStateAction<ColumnFiltersState>) => void;
  /**
   * 展开行的详情内容
   */
  renderExpanded: (row: T) => React.ReactNode;
  /**
   * 行的显示名（如国家名），用于展开按钮的无障碍名，避免全表按钮同名
   */
  rowLabel?: (row: T) => string;
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
  onClearFilters,
  onColumnFiltersChange,
  renderExpanded,
  rowLabel,
  toolbar,
}: DataTableProperties<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSort);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [innerFilters, setInnerFilters] = React.useState<ColumnFiltersState>([]);
  const filters = columnFilters ?? innerFilters;
  const setFilters = onColumnFiltersChange ?? setInnerFilters;

  const table = useTable({
    // data 换新引用（搜索、范围切换）时 TanStack 默认清空展开状态；
    // 关掉自动重置，展开才真正按行 id（国家身份）跨筛选保持
    autoResetExpanded: false,
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
  const isFiltered = rows.length > 0 && rows.length < data.length;

  return (
    <div>
      {toolbar ? <div className="mb-3">{toolbar}</div> : null}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow className="bg-muted/30" key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    aria-sort={ariaSortOf(header.column.getIsSorted())}
                    className="whitespace-nowrap"
                    colSpan={header.colSpan}
                    key={header.id}
                  >
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
                      <span>没有符合当前筛选条件的国家</span>
                      {onClearFilters
                        ? (
                            <Button
                              className="ml-3"
                              onClick={onClearFilters}
                              size="sm"
                              variant="outline"
                            >
                              清除筛选
                            </Button>
                          )
                        : null}
                    </TableCell>
                  </TableRow>
                )
              : rows.map(row => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      // 整行可点但 <tr> 原本不可聚焦：补 tabIndex + Enter/Space，
                      // 否则鼠标能展开、键盘不能（规则 click-events-have-key-events）。
                      // 不加 role="button"：那会覆盖 <tr> 的 row 角色，破坏表格语义。
                      onClick={() => row.toggleExpanded()}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") {
                          return;
                        }
                        event.preventDefault();
                        row.toggleExpanded();
                      }}
                      tabIndex={0}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell className="whitespace-nowrap" key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          aria-expanded={row.getIsExpanded()}
                          aria-label={row.getIsExpanded()
                            ? `收起${rowLabel ? rowLabel(row.original) : ""}详情`
                            : `展开${rowLabel ? rowLabel(row.original) : ""}详情`}
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
      <p className={cn("text-xs text-muted-foreground", isFiltered && "mt-2")} role="status">
        {isFiltered
          ? (
              <>
                当前显示
                {" "}
                {rows.length}
                {" / "}
                {data.length}
                {" 个国家/地区"}
              </>
            )
          : null}
      </p>
    </div>
  );
}

/**
 * TanStack 的 `getIsSorted()` → `aria-sort` 取值。
 * 未排序时不输出属性：`aria-sort="none"` 会让读屏把「可排序但当前没排」
 * 和「已确认未排序」混为一谈，规范推荐只在有序时声明。
 */
function ariaSortOf(sorted: "asc" | "desc" | false): "ascending" | "descending" | undefined {
  if (sorted === "asc") {
    return "ascending";
  }
  return sorted === "desc" ? "descending" : undefined;
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
