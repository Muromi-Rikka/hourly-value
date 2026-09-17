import { bigmac } from "@/data/bigmac";
import { wages } from "@/data/wages";

export interface BigMacPurchasingPower {
  bigMacPerHour: number;
  country: string;
  countryCode: string;
  localPrice: number;
  localPriceFormatted: string;
  localWage: number;
  localWageFormatted: string;
  region: "亚洲" | "北美" | "大洋洲" | "欧洲";
}

const currencySymbol: Record<string, string> = {
  人民币: "¥",
  加元: "C$",
  新西兰元: "NZ$",
  日元: "¥",
  欧元: "€",
  澳元: "A$",
  美元: "$",
  英镑: "£",
  韩元: "₩",
};

const wageByCode = new Map(wages.map(w => [w.countryCode, w]));

export const bigmacPpp: BigMacPurchasingPower[] = bigmac
  .map((entry) => {
    const wage = wageByCode.get(entry.countryCode);
    if (!wage) {
      return null;
    }
    const bigMacPerHour = Math.round((wage.localWage / entry.localPrice) * 10) / 10;
    const symbol = currencySymbol[wage.localCurrency] ?? "";
    return {
      bigMacPerHour,
      country: entry.country,
      countryCode: entry.countryCode,
      localPrice: entry.localPrice,
      localPriceFormatted: entry.localPriceFormatted,
      localWage: wage.localWage,
      localWageFormatted: `${symbol}${wage.localWage.toLocaleString()}/h`,
      region: entry.region,
    };
  })
  .filter((entry): entry is BigMacPurchasingPower => entry !== null);

/**
 * Sorted by bigMacPerHour descending (most Big Macs per hour first).
 */
export const sortedByBigMacPerHour = bigmacPpp.toSorted((a, b) => b.bigMacPerHour - a.bigMacPerHour);

export const regions = ["全部", "亚洲", "欧洲", "大洋洲", "北美"] as const;
