/**
 * 全站数值显示口径的唯一出口。
 *
 * 站内混着多套数据（人民币折算、本币比值、派生工时），若各处自行
 * `toFixed` / `Math.round`，同一个指标会在不同页面显示成不同精度。
 * 所有面向用户的数值格式化都应走这里。
 */

/**
 * 缺失值的统一显示
 */
export const DASH = "—";

/**
 * 一小时可购买的商品数量，如 `6.2 个`
 */
export function bigMacCount(value: null | number | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  return `${numeric(round1(value), 1)} 个`;
}

/**
 * 人民币金额，如 `¥114.4`、`¥249,900`
 */
export function cny(value: null | number | undefined, decimals = 1): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  const shown = decimals === 0 ? Math.round(value) : round1(value);
  return `¥${numeric(shown, decimals === 0 ? 0 : 1)}`;
}

/**
 * 人民币时薪，如 `¥114.4/小时`
 */
export function cnyHour(value: null | number | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  return `¥${numeric(round1(value), 1)}`;
}

/**
 * 计数缩写，四位及以上才缩，如 `1.2k`、`23k`；千位以内照常给千分位，
 * 与表格口径一致（`1,234`），不为了排版把 4 位数也塞成 `1.2k`。
 */
export function compactNumber(value: null | number | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  if (value < 10000) {
    return numeric(Math.round(value), 0);
  }
  const thousands = value / 1000;
  return `${thousands >= 100 ? numeric(Math.round(thousands), 0) : numeric(round1(thousands), 1)}k`;
}

/**
 * ISO 日期 → `2026-01-01`；无法解析时原样返回
 */
export function dateOnly(iso: null | string | undefined): string {
  if (!iso) {
    return DASH;
  }
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? iso : parsed.toISOString().slice(0, 10);
}

/**
 * 工作日，如 `37 天`。按每天 8 小时派生，非观测值。
 */
export function days(value: null | number | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  return `${numeric(value, 0)} 天`;
}

/**
 * 纯数字（不含单位），用于表格单元格自行拼接单位。
 * 分段保留有效精度：<10 两位小数，<100 一位小数，更大取整。
 */
export function hourNumber(value: null | number | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  if (value < 10) {
    return numeric(round2(value), 2);
  }
  return value < 100
    ? numeric(round1(value), 1)
    : numeric(Math.round(value), 0);
}

/**
 * 工时，如 `86.7 小时`、`1,925 小时`
 */
export function hours(value: null | number | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  return `${hourNumber(value)} 小时`;
}

/**
 * 本币数值 + 单位，如 `23 元/小时`
 */
export function localAmount(value: null | number | undefined, unit: null | string | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  const shown = value >= 100 ? numeric(Math.round(value), 0) : numeric(value, 2);
  return unit ? `${shown} ${unit}` : shown;
}

/**
 * 纯数值（1 位小数、带千分位），不含货币符号与任何单位。
 * 供需要把数值与单位分开排版的地方使用 —— 不要与 `hours` / `bigMacCount`
 * 这类已经带单位的格式函数叠加，否则单位会显示两遍。
 */
export function number1(value: null | number | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  return numeric(round1(value), 1);
}

/**
 * 百分比，带正负号，如 `+12.3%`
 */
export function percent(value: null | number | undefined, decimals = 1): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  const shown = numeric(Math.abs(value), decimals);
  const sign = value > 0 ? "+" : (value < 0 ? "-" : "");
  return `${sign}${shown}%`;
}

/**
 * 倍数，如 `18.7×`
 */
export function ratio(value: null | number | undefined): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  return `${numeric(round1(value), 1)}×`;
}

/**
 * 保留 1 位小数并去掉浮点长尾
 */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * 保留 2 位小数
 */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * 美元金额，如 `$6.42`、`$249,900`
 */
export function usd(value: null | number | undefined, decimals = 2): string {
  if (value === null || value === undefined) {
    return DASH;
  }
  const shown = decimals === 0 ? Math.round(value) : Number(value.toFixed(decimals));
  return `$${numeric(shown, decimals)}`;
}

/**
 * 千分位数字。`maxDecimals` 为最大小数位，最小小数位恒为 0。
 * 整数值不带多余的小数尾数（23.0 → 23），但保留有效精度（6.24 → 6.2）。
 */
function numeric(value: number, maxDecimals: number): string {
  return Number(value.toFixed(maxDecimals)).toLocaleString("zh-CN", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  });
}
