import type { ColumnFiltersState, RowData, SortingState } from "@tanstack/react-table";
import type * as React from "react";

import type { DataTableColumn } from "@/components/data-table";

import { DataTable } from "@/components/data-table";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { BlurText } from "@/components/react-bits/BlurText/BlurText";
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
   * 表格空状态时的「清除筛选」回调；不传则不渲染按钮
   */
  onClearFilters?: () => void;
  onColumnFiltersChange?: (updater: React.SetStateAction<ColumnFiltersState>) => void;
  renderExpanded: (row: T) => React.ReactNode;
  /**
   * 页面标题（同时作为浏览器标签标题的一部分）
   */
  title: string;
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
  onClearFilters,
  onColumnFiltersChange,
  renderExpanded,
  title,
  toolbar,
}: ExploreViewProperties<T>) {
  return (
    <div>
      <div className="pb-6">
        <BlurText
          animateBy="words"
          className="text-balance font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.1] tracking-[-0.02em]"
          delay={150}
          text={title}
        />
        <AnimatedContent delay={0.1} distance={20} duration={0.5}>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
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
