import type { IPhoneEntry } from "@/data/iphone";
import type { Region } from "@/lib/region";

import { iphones } from "@/data/iphone";
import { wages } from "@/data/wages";

/**
 * Merge iPhone prices with minimum wage to compute hours of work needed.
 */
export interface IPhoneIndexEntry {
  country: string;
  countryCode: string;
  /**
   * Minimum hourly wage in CNY; null if no wage data
   */
  hourlyWage: null | number;
  /**
   * Hours of minimum-wage work to buy one iPhone; null if no wage data
   */
  hoursToBuy: null | number;
  /**
   * iPhone 18 Pro price in CNY
   */
  iphonePrice: number;
  iphoneSource: string;
  iphoneSourceUrl: string;
  localCurrency: string;
  /**
   * iPhone 18 Pro local price
   */
  localPrice: number;
  region: Region;
  taxNote: string;
  wageSource: string;
  wageSourceUrl: string;
}

const wageByCode = new Map(wages.map(w => [w.countryCode, w]));

export const iphoneIndex: IPhoneIndexEntry[] = iphones.map((phone: IPhoneEntry) => {
  const wage = wageByCode.get(phone.countryCode);
  const hourlyWage = wage?.cnyEquivalent ?? null;
  const hoursToBuy = hourlyWage === null || hourlyWage <= 0
    ? null
    : Math.round((phone.cnyEquivalent / hourlyWage) * 10) / 10;
  return {
    country: phone.country,
    countryCode: phone.countryCode,
    hourlyWage,
    hoursToBuy,
    iphonePrice: phone.cnyEquivalent,
    iphoneSource: phone.source,
    iphoneSourceUrl: phone.sourceUrl,
    localCurrency: phone.localCurrency,
    localPrice: phone.localPrice,
    region: phone.region,
    taxNote: phone.taxNote,
    wageSource: wage?.source ?? "",
    wageSourceUrl: wage?.sourceUrl ?? "",
  };
});

/**
 * Sorted by hoursToBuy ascending (fewest hours = cheapest). Nulls (no data) go last.
 */
export const sortedByHours = iphoneIndex.toSorted((a, b) => {
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
