import type { ModelYEntry } from "@/data/modely";
import type { Region } from "@/lib/region";

import { modelys } from "@/data/modely";
import { wages } from "@/data/wages";

/**
 * Merge Model Y prices with minimum wage to compute hours of work needed.
 */
export interface ModelYIndexEntry {
  country: string;
  countryCode: string;
  /**
   * 由 8 小时工作日派生的天数，不是观测值；null if no wage data
   */
  daysToBuy: null | number;
  /**
   * Minimum hourly wage in CNY; null if no wage data
   */
  hourlyWage: null | number;
  /**
   * Hours of minimum-wage work to buy one Model Y; null if no wage data
   */
  hoursToBuy: null | number;
  localCurrency: string;
  /**
   * Tesla Model Y local price
   */
  localPrice: number;
  /**
   * Tesla Model Y price in CNY
   */
  modelyPrice: number;
  modelySource: string;
  modelySourceUrl: string;
  region: Region;
  taxNote: string;
  wageSource: string;
  wageSourceUrl: string;
}

const wageByCode = new Map(wages.map(w => [w.countryCode, w]));

export const modelyIndex: ModelYIndexEntry[] = modelys.map((car: ModelYEntry) => {
  const wage = wageByCode.get(car.countryCode);
  const hourlyWage = wage?.cnyEquivalent ?? null;
  const hoursToBuy = hourlyWage === null || hourlyWage <= 0
    ? null
    : Math.round((car.cnyEquivalent / hourlyWage) * 10) / 10;
  // 天数是按每天 8 小时派生的辅助值，跨地区比较应以 hoursToBuy 为准
  const daysToBuy = hoursToBuy === null
    ? null
    : Math.ceil(hoursToBuy / 8);
  return {
    country: car.country,
    countryCode: car.countryCode,
    daysToBuy,
    hourlyWage,
    hoursToBuy,
    localCurrency: car.localCurrency,
    localPrice: car.localPrice,
    modelyPrice: car.cnyEquivalent,
    modelySource: car.source,
    modelySourceUrl: car.sourceUrl,
    region: car.region,
    taxNote: car.taxNote,
    wageSource: wage?.source ?? "",
    wageSourceUrl: wage?.sourceUrl ?? "",
  };
});

/**
 * Sorted by hoursToBuy ascending (fewest hours = cheapest). Nulls (no data) go last.
 * 跨地区比较以小时为准，天数只是按每天 8 小时的换算。
 */
export const sortedByHours = modelyIndex.toSorted((a, b) => {
  if (a.hoursToBuy === null && b.hoursToBuy === null) {
    return 0;
  }
  if (a.hoursToBuy === null) {
    return 1;
  }
  if (b.hoursToBuy === null) {
    return -1;
  }
  return a.hoursToBuy - b.hoursToBuy;
});

/**
 * Sorted by daysToBuy ascending (fewest days = cheapest). Nulls (no data) go last.
 */
export const sortedByDays = modelyIndex.toSorted((a, b) => {
  if (a.daysToBuy === null && b.daysToBuy === null) {
    return 0;
  }
  if (a.daysToBuy === null) {
    return 1;
  }
  if (b.daysToBuy === null) {
    return -1;
  }
  return a.daysToBuy - b.daysToBuy;
});
