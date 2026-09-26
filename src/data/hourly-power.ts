import type { HoursBasis } from "@/data/wages";
import type { Region } from "@/lib/region";

import { sortedByBigMacPerHour } from "@/data/bigmac-ppp";
import { commodityIndex } from "@/data/commodity-index";
import { iphoneIndex } from "@/data/iphone-index";
import { modelyIndex } from "@/data/modely-index";
import { wages } from "@/data/wages";
import {
  bigMacCount,
  cnyHour as formatCnyHour,
  hours as formatHours,
  ratio as formatRatio,
} from "@/lib/format";

/**
 * 「一小时购买力」的统一行：把工资与四类消费指标按 countryCode 联结到一行。
 * 五套指数各自的口径不变，这里只做联结与派生，不重算任何来源数据。
 */
export interface HourlyPowerEntry {
  /**
   * 买一篮基础物资所需工时；null = 该国无物资价格数据
   */
  basketHours: null | number;
  /**
   * 一小时最低工资能买几个巨无霸（本币相除，不过汇率）；null = 无巨无霸价格
   */
  bigMacPerHour: null | number;
  /**
   * 人民币折算时薪 —— 这是工资"水平"，不是购买力
   */
  cnyHour: number;
  country: string;
  countryCode: string;
  /**
   * 已有数据的指标数：1（工资）+ 四项消费指标，上限 5
   */
  coverage: number;
  effectiveDate: string;
  hoursBasis: HoursBasis;
  /**
   * 买一部 iPhone 18 Pro 所需工时；null = 无 iPhone 价格
   */
  iphoneHours: null | number;
  /**
   * 无全国统一标准，取地区中位数或集体协议口径
   */
  isProxy: boolean;
  localCurrency: string;
  localUnit: string;
  localWage: number;
  modelyDays: null | number;
  modelyHours: null | number;
  region: Region;
  /**
   * 换算时薪所用的工时数（按月/按日设定的国家才有）
   */
  statutoryHours: null | number;
  /**
   * 法定周工时上限；来源未明确时为 null，不做外推
   */
  statutoryWeeklyHours: null | number;
  wageSource: string;
  wageSourceUrl: string;
}

const bigMacByCode = new Map(sortedByBigMacPerHour.map(entry => [entry.countryCode, entry]));
const basketByCode = new Map(commodityIndex.map(entry => [entry.countryCode, entry.hoursToBuy]));
const iphoneByCode = new Map(iphoneIndex.map(entry => [entry.countryCode, entry.hoursToBuy]));
const modelyByCode = new Map(modelyIndex.map(entry => [entry.countryCode, entry]));

export const hourlyPower: HourlyPowerEntry[] = wages.map((wage) => {
  const modely = modelyByCode.get(wage.countryCode);
  const basketHours = basketByCode.get(wage.countryCode) ?? null;
  const bigMacPerHour = bigMacByCode.get(wage.countryCode)?.bigMacPerHour ?? null;
  const iphoneHours = iphoneByCode.get(wage.countryCode) ?? null;
  const modelyHours = modely?.hoursToBuy ?? null;
  const coverage = 1
    + [basketHours, bigMacPerHour, iphoneHours, modelyHours].filter(value => value !== null).length;

  return {
    basketHours,
    bigMacPerHour,
    cnyHour: wage.cnyEquivalent,
    country: wage.country,
    countryCode: wage.countryCode,
    coverage,
    effectiveDate: wage.effectiveDate,
    hoursBasis: wage.hoursBasis,
    iphoneHours,
    isProxy: wage.isProxy,
    localCurrency: wage.localCurrency,
    localUnit: wage.localUnit,
    localWage: wage.localWage,
    modelyDays: modely?.daysToBuy ?? null,
    modelyHours,
    region: wage.region,
    statutoryHours: wage.statutoryHours,
    statutoryWeeklyHours: wage.statutoryWeeklyHours,
    wageSource: wage.source,
    wageSourceUrl: wage.sourceUrl,
  };
});

const powerByCode = new Map(hourlyPower.map(entry => [entry.countryCode, entry]));

export function hourlyPowerOf(countryCode: string): HourlyPowerEntry | undefined {
  return powerByCode.get(countryCode);
}

/**
 * 五指数齐备的国家集合。
 *
 * 由数据推导而非硬编码：任一数据集新增覆盖国家都会自动进入。
 * 截至 2026-09 为 23 个 —— iPhone 缺希腊、以色列（无官方在线商城），
 * 物资篮缺卢森堡（来源站整站无数据）、印度（缺牛肉价）。
 */
export const commonCodes: string[] = hourlyPower
  .filter(entry => entry.coverage === 5)
  .map(entry => entry.countryCode)
  .toSorted((a, b) => a.localeCompare(b));

const commonSet = new Set(commonCodes);

export const commonHourlyPower = hourlyPower.filter(entry => commonSet.has(entry.countryCode));

/**
 * 指标分组：钱包卡片与对比表按这个顺序分层
 */
export type MetricGroup = "car" | "food" | "goods" | "wage";

export const METRIC_GROUP_LABEL: Record<MetricGroup, string> = {
  car: "大件耐用品",
  food: "日常饮食",
  goods: "随身物品",
  wage: "工资基准",
};

export interface HourlyMetric {
  format: (value: null | number) => string;
  formatAxis: (value: number) => string;
  get: (entry: HourlyPowerEntry) => null | number;
  group: MetricGroup;
  /**
   * 数值越大越好（能买更多 / 折算更贵），false 表示越小越好
   */
  higherIsBetter: boolean;
  /**
   * 取值字段，同时也是排序与筛选的 id
   */
  key: "basketHours" | "bigMacPerHour" | "cnyHour" | "iphoneHours" | "modelyHours";
  label: string;
  /**
   * 口径说明，展示在 tooltip 与表格展开行
   */
  note: string;
  unit: string;
}

/**
 * 全站「一小时购买力」的唯一指标定义。
 * 钱包、对比、矩阵表、排行图都从这里取标签与格式化，避免各页面各写一套。
 */
export const HOURLY_METRICS: HourlyMetric[] = [
  {
    format: formatCnyHour,
    formatAxis: value => `¥${Math.round(value)}`,
    get: entry => entry.cnyHour,
    group: "wage",
    higherIsBetter: true,
    key: "cnyHour",
    label: "人民币时薪",
    note: "各国法定最低时薪按构建时市场汇率折算。这只是工资水平，不等于购买力。",
    unit: "¥/小时",
  },
  {
    format: bigMacCount,
    formatAxis: value => `${value}个`,
    get: entry => entry.bigMacPerHour,
    group: "food",
    higherIsBetter: true,
    key: "bigMacPerHour",
    label: "1 小时能买巨无霸",
    note: "当地最低时薪 ÷ 当地巨无霸售价，全程本币相除，不经过汇率。",
    unit: "个/小时",
  },
  {
    format: formatHours,
    formatAxis: value => `${Math.round(value)}h`,
    get: entry => entry.basketHours,
    group: "food",
    higherIsBetter: false,
    key: "basketHours",
    label: "买基础物资篮",
    note: "固定 9 件食品篮（米面油肉蛋奶糖盐）总价 ÷ 人民币时薪。价格快照与汇率更新日期不同。",
    unit: "小时",
  },
  {
    format: formatHours,
    formatAxis: value => `${Math.round(value)}h`,
    get: entry => entry.iphoneHours,
    group: "goods",
    higherIsBetter: false,
    key: "iphoneHours",
    label: "买 iPhone 18 Pro",
    note: "Apple 官方商城本币标价折算人民币后 ÷ 时薪。各地区含税口径不同。",
    unit: "小时",
  },
  {
    format: formatHours,
    formatAxis: value => `${Math.round(value)}h`,
    get: entry => entry.modelyHours,
    group: "car",
    higherIsBetter: false,
    key: "modelyHours",
    label: "买 Model Y",
    note: "特斯拉官网本币标价折算人民币后 ÷ 时薪。跨地区请以小时比较，天数只是按每天 8 小时的换算。",
    unit: "小时",
  },
];

const metricByKey = new Map(HOURLY_METRICS.map(metric => [metric.key, metric]));

export interface CompareRow {
  a: HourlyPowerEntry;
  b: HourlyPowerEntry;
  metric: HourlyMetric;
  /**
   * null = 双方任一指标缺失
   */
  ratio: null | number;
  valueA: null | number;
  valueB: null | number;
}

type ScoredRow = CompareRow & { ratio: number };

/**
 * 两个国家的逐指标对比
 */
export function comparePair(a: HourlyPowerEntry, b: HourlyPowerEntry): CompareRow[] {
  return HOURLY_METRICS.map((metric) => {
    const valueA = metric.get(a);
    const valueB = metric.get(b);
    return { a, b, metric, ratio: favorRatio(metric, valueA, valueB), valueA, valueB };
  });
}

export function metricFor(key: HourlyMetric["key"]): HourlyMetric | undefined {
  return metricByKey.get(key);
}

/**
 * 差距最大的那一项，作为一句话结论
 */
export function verdictOf(rows: CompareRow[]): null | string {
  const scored = rows
    .filter((row): row is ScoredRow => row.ratio !== null)
    .toSorted((x, y) => y.ratio - x.ratio);
  const top = scored[0];
  if (!top) {
    return null;
  }
  if (Math.abs(top.ratio - 1) < 0.05) {
    return `${top.a.country}与${top.b.country}在「${top.metric.label}」上基本持平`;
  }
  const isALeads = top.ratio >= 1;
  const leader = isALeads ? top.a : top.b;
  const follower = isALeads ? top.b : top.a;
  const lead = isALeads ? top.ratio : 1 / top.ratio;
  const leaderValue = isALeads ? top.valueA : top.valueB;
  const followerValue = isALeads ? top.valueB : top.valueA;
  return `${leader.country}「${top.metric.label}」${top.metric.format(leaderValue)}，`
    + `${follower.country}为 ${top.metric.format(followerValue)}，相差 ${formatRatio(lead)}`;
}

/**
 * 购买 X 需要多少个法定工作周。缺周工时口径时返回 null。
 */
export function workWeeks(entry: HourlyPowerEntry, neededHours: null | number): null | number {
  if (neededHours === null || entry.statutoryWeeklyHours === null || entry.statutoryWeeklyHours === 0) {
    return null;
  }
  return neededHours / entry.statutoryWeeklyHours;
}

/**
 * A 相对 B 的优势倍数：>1 表示 A 更宽裕。
 * 缺失值与 0 一律返回 null，绝不用 0 冒充"买不起"。
 */
function favorRatio(metric: HourlyMetric, a: null | number, b: null | number): null | number {
  if (a === null || b === null || a === 0 || b === 0) {
    return null;
  }
  return metric.higherIsBetter ? a / b : b / a;
}
