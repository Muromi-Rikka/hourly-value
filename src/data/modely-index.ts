import type { ModelYEntry } from "@/data/modely";
import { modelys } from "@/data/modely";
import { wages } from "@/data/wages";

/**
 * Merge Model Y prices with minimum wage to compute days of work needed.
 */
export interface ModelYIndexEntry {
  country: string;
  countryCode: string;
  /**
   * Days of minimum-wage work (8h/day) to buy one Model Y; null if no wage data
   */
  daysToBuy: null | number;
  /**
   * Minimum hourly wage in CNY
   */
  hourlyWage: number;
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
  region: "中东" | "亚洲" | "北美" | "南美" | "大洋洲" | "欧洲";
  taxNote: string;
  wageSource: string;
  wageSourceUrl: string;
}

const wageByCode = new Map(wages.map(w => [w.countryCode, w]));

export const modelyIndex: ModelYIndexEntry[] = modelys.map((car: ModelYEntry) => {
  const wage = wageByCode.get(car.countryCode);
  const hourlyWage = wage?.cnyEquivalent ?? 0;
  const hoursToBuy = wage
    ? Math.round((car.cnyEquivalent / hourlyWage) * 10) / 10
    : null;
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
