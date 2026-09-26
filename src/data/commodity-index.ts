import type { CommodityItem } from "@/data/commodity";
import type { Region } from "@/lib/region";

import { commodities, COMMODITY_SOURCE } from "@/data/commodity";
import { cnyPerUnit } from "@/data/exchange-rates";
import { wages } from "@/data/wages";

/**
 * Merge commodity basket prices with minimum wage to compute hours of work needed
 * to buy a fixed basket of essential goods.
 *
 * Basket contents:
 *   5kg 面粉 · 5kg 大米 · 1kg 食糖 · 1kg 食盐 · 2L 牛奶 · 24个鸡蛋 · 5L 食用油 · 1kg 牛肉 · 1kg 鸡肉
 */
export interface CommodityIndexEntry {
  /**
   * 篮子总价 CNY
   */
  basketCNY: number;
  /**
   * 篮子总价 USD
   */
  basketUSD: number;
  commoditySource: string;
  country: string;
  countryCode: string;
  /**
   * Minimum hourly wage in CNY; null if no wage data
   */
  hourlyWage: null | number;
  /**
   * Hours of minimum-wage work to buy the basket; null if no wage data
   */
  hoursToBuy: null | number;
  region: Region;
  wageSource: string;
  wageSourceUrl: string;
}

const wageByCode = new Map(wages.map(w => [w.countryCode, w]));

/**
 * Derive USD→CNY exchange rate from the latest fetched rates.
 * 构建时拉取的最新汇率（scripts/fetch-rates.mjs）。
 */
const usdToCny = cnyPerUnit["美元"];

function basketUSD(item: CommodityItem): number {
  return (
    item.flour1kg * 5
    + item.rice1kg * 5
    + item.sugar1kg * 1
    + item.salt1kg * 1
    + item.milk1l * 2
    + item.eggs12 * 2
    + item.oil1l * 5
    + item.beef1kg * 1
    + item.chicken1kg * 1
  );
}

export const commodityIndex: CommodityIndexEntry[] = commodities
  .map((item) => {
    const wage = wageByCode.get(item.countryCode);
    const hourlyWage = wage?.cnyEquivalent ?? null;
    const bUSD = Math.round(basketUSD(item) * 100) / 100;
    const bCNY = Math.round(bUSD * usdToCny * 100) / 100;
    // 无工资数据时必须是 null：0 会被排到"最便宜"一侧，等于伪造一个观测值
    const hours = hourlyWage === null || hourlyWage <= 0
      ? null
      : Math.round((bCNY / hourlyWage) * 100) / 100;

    return {
      basketCNY: bCNY,
      basketUSD: bUSD,
      commoditySource: COMMODITY_SOURCE.name,
      country: item.country,
      countryCode: item.countryCode,
      hourlyWage,
      hoursToBuy: hours,
      region: item.region,
      wageSource: wage?.source ?? "",
      wageSourceUrl: wage?.sourceUrl ?? "",
    };
  });

/**
 * Sorted by hours ascending (fewest hours = most affordable). Nulls (no data) go last.
 */
export const sortedByHours = commodityIndex.toSorted((a, b) => {
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
