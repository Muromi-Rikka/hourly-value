/**
 * 区域 → 主题色变量的唯一映射。图表、徽章、tooltip 共用。
 */
const REGION_KEYS: Record<string, string> = {
  中东: "middle-east",
  亚洲: "asia",
  北美: "north-america",
  南美: "south-america",
  大洋洲: "oceania",
  欧洲: "europe",
};

/**
 * 返回 `var(--color-region-*)`，随明暗主题自动切换
*/
export function regionColor(region: string): string {
  return `var(--color-region-${regionKey(region)})`;
}

export function regionKey(region: string): string {
  return REGION_KEYS[region] ?? "oceania";
}

/**
 * 图表图例，顺序与数据分组一致
*/
export const regionLegend = [
  { color: "var(--color-region-asia)", label: "亚洲" },
  { color: "var(--color-region-europe)", label: "欧洲" },
  { color: "var(--color-region-oceania)", label: "大洋洲" },
  { color: "var(--color-region-north-america)", label: "北美" },
  { color: "var(--color-region-south-america)", label: "南美" },
  { color: "var(--color-region-middle-east)", label: "中东" },
] as const;

export interface RegionStat {
  avg: number;
  count: number;
  region: string;
}

/**
 * 按区域分组求均值。
 *
 * @param entries 参与统计的行
 * @param getValue 取数函数，返回参与平均的数值
 * @param options 分组选项
 * @param options.decimals 保留小数位，默认 0（取整）
 * @param options.order 排序方向，asc = 均值从小到大
 */
export function regionAverages<T>(
  entries: T[],
  getValue: (item: T) => number,
  options: { decimals?: number; order?: "asc" | "desc" } = {},
): RegionStat[] {
  const { decimals = 0, order = "asc" } = options;
  const grouped = new Map<string, number[]>();
  for (const entry of entries) {
    const region = (entry as { region: string }).region;
    const bucket = grouped.get(region);
    if (bucket) {
      bucket.push(getValue(entry));
    }
    else {
      grouped.set(region, [getValue(entry)]);
    }
  }

  const factor = 10 ** decimals;
  return grouped
    .entries()
    .map(([region, values]) => ({
      avg: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * factor) / factor,
      count: values.length,
      region,
    }))
    .toArray()
    .toSorted((a, b) => order === "asc" ? a.avg - b.avg : b.avg - a.avg);
}
