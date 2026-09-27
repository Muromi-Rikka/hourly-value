import type { ColumnFiltersState, RowData, SortingState } from "@tanstack/react-table";
import type * as React from "react";

import type { DataTableColumn } from "@/components/data-table";

import { DataTable } from "@/components/data-table";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExploreViewProperties<T extends RowData> {
  /**
   * 图表视图本体
   */
  chart: React.ReactNode;
  /**
   * 图表视图的口径说明
   */
  chartCaption: React.ReactNode;
  /**
   * 排序主指标切换器（跨指数页用：一次只看一个指标）
   */
  chartControls?: React.ReactNode;
  columnFilters?: ColumnFiltersState;
  columns: DataTableColumn<T>[];
  data: T[];
  defaultSort: SortingState;
  /**
   * 副标题，写清数据口径与条数
   */
  description: React.ReactNode;
  /**
   * 行 id 取值，透传给 DataTable；筛选/换数据后展开状态按身份而非行序保持
   */
  getRowId?: (row: T) => string;
  /**
   * 表格空状态时的「清除筛选」回调；不传则不渲染按钮
   */
  onClearFilters?: () => void;
  onColumnFiltersChange?: (updater: React.SetStateAction<ColumnFiltersState>) => void;
  renderExpanded: (row: T) => React.ReactNode;
  /**
   * 传入后表格按它重挂，用于切换数据口径时换上新的默认排序；
   * 不传则表格保持挂载（现有页面行为不变）
   */
  tableKey?: React.Key;
  /**
   * 页面标题（同时作为浏览器标签标题的一部分）
   */
  title: string;
  /**
   * 标题层级：独立成页时 h1，嵌在其他页面里时 h2
   */
  titleTag?: "h1" | "h2";
  /**
   * 表格工具条（搜索、区域筛选、覆盖率筛选）
   */
  toolbar?: React.ReactNode;
}

/**
 * 指数数据探索页的统一骨架：标题 → 口径说明 → 表格/图表切换。
 * 五个 explore 页与跨指数页共用，只传数据与列定义。
 */
export function ExploreView<T extends RowData>({
  chart,
  chartCaption,
  chartControls,
  columnFilters,
  columns,
  data,
  defaultSort,
  description,
  getRowId,
  onClearFilters,
  onColumnFiltersChange,
  renderExpanded,
  tableKey,
  title,
  titleTag = "h1",
  toolbar,
}: ExploreViewProperties<T>) {
  const titleClass = titleTag === "h1" ? "page-title" : "section-title";

  return (
    <div>
      <div className="pb-2">
        <SplitText
          className={titleClass}
          delay={80}
          duration={0.8}
          ease="power3.out"
          splitType="words"
          tag={titleTag}
          text={title}
        />
        <AnimatedContent delay={0.1} distance={20} duration={0.5}>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
        </AnimatedContent>
      </div>

      <AnimatedContent delay={0.1} distance={40} duration={0.6} threshold={0.05}>
        <Tabs defaultValue="table">
          <TabsList className="mt-4">
            <TabsTrigger value="table">表格视图</TabsTrigger>
            <TabsTrigger value="chart">图表视图</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-4" value="table">
            <DataTable
              columnFilters={columnFilters}
              columns={columns}
              data={data}
              defaultSort={defaultSort}
              getRowId={getRowId}
              key={tableKey}
              onClearFilters={onClearFilters}
              onColumnFiltersChange={onColumnFiltersChange}
              renderExpanded={renderExpanded}
              toolbar={toolbar}
            />
          </TabsContent>

          <TabsContent className="mt-4" value="chart">
            <div>
              {chartControls ? <div className="mb-3">{chartControls}</div> : null}
              <p className="mb-3 text-sm text-muted-foreground">{chartCaption}</p>
              {chart}
            </div>
          </TabsContent>
        </Tabs>
      </AnimatedContent>
    </div>
  );
}
