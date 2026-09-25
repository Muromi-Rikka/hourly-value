import type { CommodityItem } from "@/data/commodity";
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
   * Minimum hourly wage in CNY
   */
  hourlyWage: number;
  /**
   * Hours of minimum-wage work to buy the basket
   */
  hoursToBuy: number;
  region: "中东" | "亚洲" | "北美" | "南美" | "大洋洲" | "欧洲";
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
    const hourlyWage = wage?.cnyEquivalent ?? 0;
    const bUSD = Math.round(basketUSD(item) * 100) / 100;
    const bCNY = Math.round(bUSD * usdToCny * 100) / 100;
    const hours = hourlyWage > 0
      ? Math.round((bCNY / hourlyWage) * 100) / 100
      : 0;

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
 * Sorted by hours ascending (fewest hours = most affordable).
 */
export const sortedByHours = commodityIndex.toSorted(
  (a, b) => a.hoursToBuy - b.hoursToBuy,
);
