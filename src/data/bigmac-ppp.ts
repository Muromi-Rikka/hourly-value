import type { Region } from "@/lib/region";

import { bigmac } from "@/data/bigmac";
import { wages } from "@/data/wages";

export interface BigMacPurchasingPower {
  /**
   * 最低时薪 ÷ 当地售价，全部在本币内完成，不经过汇率
   */
  bigMacPerHour: number;
  country: string;
  countryCode: string;
  localPrice: number;
  localPriceFormatted: string;
  localWage: number;
  localWageFormatted: string;
  region: Region;
}

const currencySymbol: Record<string, string> = {
  人民币: "¥",
  加元: "C$",
  匈牙利福林: "Ft",
  印度卢比: "₹",
  捷克克朗: "Kč",
  新西兰元: "NZ$",
  新谢克尔: "₪",
  日元: "¥",
  智利比索: "CLP$",
  欧元: "€",
  波兰兹罗提: "zł",
  泰铢: "฿",
  澳元: "A$",
  美元: "$",
  英镑: "£",
  菲律宾比索: "₱",
  韩元: "₩",
  马来西亚林吉特: "RM",
  墨西哥比索: "Mex$",
};

const wageByCode = new Map(wages.map(w => [w.countryCode, w]));

const bigmacPpp: BigMacPurchasingPower[] = bigmac
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
