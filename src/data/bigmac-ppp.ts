import type { WageEntry } from "@/data/wages";
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

/**
 * 工资口径可注入：`pickLocalHourly` 决定用哪一套**本币**时薪
 * （官方时薪口径 / 月薪折算口径）。巨无霸全程本币相除，故取本币值而非人民币值。
 */
export function buildBigMacPpp(pickLocalHourly: (wage: WageEntry) => number): BigMacPurchasingPower[] {
  return bigmac
    .map((entry) => {
      const wage = wageByCode.get(entry.countryCode);
      if (!wage) {
        return null;
      }
      const localHourly = pickLocalHourly(wage);
      const bigMacPerHour = Math.round((localHourly / entry.localPrice) * 10) / 10;
      const symbol = currencySymbol[wage.localCurrency] ?? "";
      return {
        bigMacPerHour,
        country: entry.country,
        countryCode: entry.countryCode,
        localPrice: entry.localPrice,
        localPriceFormatted: entry.localPriceFormatted,
        localWage: localHourly,
        localWageFormatted: `${symbol}${localHourly.toLocaleString()}/h`,
        region: entry.region,
      };
    })
    .filter((entry): entry is BigMacPurchasingPower => entry !== null);
}

const bigmacPpp: BigMacPurchasingPower[] = buildBigMacPpp(wage => wage.localWage);

/**
 * Sorted by bigMacPerHour descending (most Big Macs per hour first).
 */
export const sortedByBigMacPerHour = bigmacPpp.toSorted((a, b) => b.bigMacPerHour - a.bigMacPerHour);
