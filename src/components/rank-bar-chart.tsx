import type * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { RegionLegend } from "@/components/region-legend";
import { shouldReduceMotion } from "@/lib/reduced-motion";
import { regionColor } from "@/lib/region";

/**
 * 各指数 tooltip 的公共入参形状
*/
export interface RankTooltipProperties<T> {
  active?: boolean;
  payload?: Array<{ payload: T }>;
}

interface RankBarChartProperties<T> {
  /**
  * 已按业务口径筛掉空值的数据；本组件负责升序排序
  */
  data: T[];
  /**
  * 坐标轴刻度格式，如 `¥114`、`12h`、`3天`
  */
  formatTick: (value: number) => string;
  /**
  * 柱末数值标签格式
  */
  formatValue: (value: number) => string;
  /**
  * 横向条形图（左轴国家）还是纵向柱图（下轴国家）
  */
  layout?: "horizontal" | "vertical";
  /**
  * 是否画 0 基准线（估值类数据需要）
  */
  showZeroLine?: boolean;
  tooltip: React.ComponentType<RankTooltipProperties<T>>;
  /**
  * 取值字段，须为数值
  */
  valueKey: keyof T & string;
}

interface ValueLabelProperties extends Record<string, unknown> {
  format: (value: number) => string;
}

/**
 * 五大指数共用的排行条形图。
 * 按区域着色，底部固定图例；横向布局时柱末标注数值。
 */
export function RankBarChart<T extends { country: string; countryCode: string; region: string }>({
  data,
  formatTick,
  formatValue,
  layout = "vertical",
  showZeroLine = false,
  tooltip,
  valueKey,
}: RankBarChartProperties<T>) {
  const rows = data
    .map(row => ({ ...row, __value: Number(row[valueKey]) }))
    .toSorted((a, b) => a.__value - b.__value);
  const TooltipContent = tooltip;

  if (layout === "horizontal") {
    return (
      <div>
        <ResponsiveContainer height={Math.max(300, rows.length * 40)} width="100%">
          <BarChart data={rows} layout="vertical" margin={{ bottom: 8, left: 8, right: 40, top: 8 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis
              axisLine={{ stroke: "var(--color-border)" }}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              tickFormatter={formatTick}
              tickLine={false}
              type="number"
            />
            <YAxis
              axisLine={false}
              dataKey="country"
              tick={{ fill: "var(--color-foreground)", fontSize: 12 }}
              tickLine={false}
              type="category"
              width={80}
            />
            {showZeroLine && (
              <ReferenceLine stroke="var(--color-muted-foreground)" strokeDasharray="4 4" x={0} />
            )}
            <Tooltip content={<TooltipContent />} cursor={false} />
            <Bar
              animationBegin={200}
              animationDuration={800}
              dataKey="__value"
              isAnimationActive={!shouldReduceMotion()}
              maxBarSize={28}
              radius={[0, 4, 4, 0]}
            >
              {rows.map(row => (
                <Cell fill={regionColor(row.region)} key={row.countryCode} />
              ))}
              <LabelList
                content={<ValueLabel format={formatValue} />}
                dataKey="__value"
                position="right"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <RegionLegend />
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer height={400} width="100%">
        <BarChart data={rows} margin={{ bottom: 40, left: 8, right: 8, top: 24 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            angle={-45}
            axisLine={{ stroke: "var(--color-border)" }}
            dataKey="country"
            height={60}
            textAnchor="end"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            tickFormatter={formatTick}
            tickLine={false}
          />
          {showZeroLine && (
            <ReferenceLine stroke="var(--color-muted-foreground)" strokeDasharray="4 4" y={0} />
          )}
          <Tooltip content={<TooltipContent />} cursor={false} />
          <Bar
            animationBegin={200}
            animationDuration={800}
            dataKey="__value"
            isAnimationActive={!shouldReduceMotion()}
            maxBarSize={48}
            radius={[4, 4, 0, 0]}
          >
            {rows.map(row => (
              <Cell fill={regionColor(row.region)} key={row.countryCode} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <RegionLegend />
    </div>
  );
}

function ValueLabel(properties: ValueLabelProperties) {
  const { format, value, width, x, y } = properties;
  if (typeof value !== "number" || typeof width !== "number" || typeof x !== "number" || typeof y !== "number") {
    return null;
  }
  return (
    <text
      className="fill-muted-foreground text-xs tabular-nums"
      x={x + width + 6}
      y={y + 14}
    >
      {format(value)}
    </text>
  );
}
