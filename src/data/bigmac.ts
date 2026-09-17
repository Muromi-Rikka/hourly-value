export interface BigMacEntry {
  country: string;
  countryCode: string;
  dataDate: string;
  localCurrency: string;
  localPrice: number;
  localPriceFormatted: string;
  region: "亚洲" | "北美" | "大洋洲" | "欧洲";
  usdPrice: number;
  valuationPct: number;
}

const usPrice = 6.22;

export const bigmac: BigMacEntry[] = [
  {
    country: "英国",
    countryCode: "GB",
    dataDate: "2026年最新统计",
    localCurrency: "英镑",
    localPrice: 5.49,
    localPriceFormatted: "£5.49",
    region: "欧洲",
    usdPrice: 6.97,
    valuationPct: Math.round(((6.97 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "卢森堡",
    countryCode: "LU",
    dataDate: "2026年最新统计",
    localCurrency: "欧元",
    localPrice: 5.8,
    localPriceFormatted: "€5.80",
    region: "欧洲",
    usdPrice: 6.38,
    valuationPct: Math.round(((6.38 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "德国",
    countryCode: "DE",
    dataDate: "2026年最新统计",
    localCurrency: "欧元",
    localPrice: 5.8,
    localPriceFormatted: "€5.80",
    region: "欧洲",
    usdPrice: 6.38,
    valuationPct: Math.round(((6.38 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "法国",
    countryCode: "FR",
    dataDate: "2026年最新统计",
    localCurrency: "欧元",
    localPrice: 5.8,
    localPriceFormatted: "€5.80",
    region: "欧洲",
    usdPrice: 6.38,
    valuationPct: Math.round(((6.38 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "荷兰",
    countryCode: "NL",
    dataDate: "2026年最新统计",
    localCurrency: "欧元",
    localPrice: 5.8,
    localPriceFormatted: "€5.80",
    region: "欧洲",
    usdPrice: 6.38,
    valuationPct: Math.round(((6.38 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "西班牙",
    countryCode: "ES",
    dataDate: "2026年最新统计",
    localCurrency: "欧元",
    localPrice: 5.8,
    localPriceFormatted: "€5.80",
    region: "欧洲",
    usdPrice: 6.38,
    valuationPct: Math.round(((6.38 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "美国",
    countryCode: "US",
    dataDate: "2026年最新统计",
    localCurrency: "美元",
    localPrice: 6.22,
    localPriceFormatted: "$6.22",
    region: "北美",
    usdPrice: 6.22,
    valuationPct: 0,
  },
  {
    country: "加拿大",
    countryCode: "CA",
    dataDate: "2026年最新统计",
    localCurrency: "加元",
    localPrice: 7.75,
    localPriceFormatted: "C$7.75",
    region: "北美",
    usdPrice: 5.7,
    valuationPct: Math.round(((5.7 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "澳大利亚",
    countryCode: "AU",
    dataDate: "2026年最新统计",
    localCurrency: "澳元",
    localPrice: 8.55,
    localPriceFormatted: "A$8.55",
    region: "大洋洲",
    usdPrice: 5.7,
    valuationPct: Math.round(((5.7 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "新西兰",
    countryCode: "NZ",
    dataDate: "2026年最新统计",
    localCurrency: "新西兰元",
    localPrice: 8.8,
    localPriceFormatted: "NZ$8.80",
    region: "大洋洲",
    usdPrice: 5.06,
    valuationPct: Math.round(((5.06 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "韩国",
    countryCode: "KR",
    dataDate: "2026年最新统计",
    localCurrency: "韩元",
    localPrice: 5500,
    localPriceFormatted: "₩5,500",
    region: "亚洲",
    usdPrice: 4.15,
    valuationPct: Math.round(((4.15 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "中国",
    countryCode: "CN",
    dataDate: "2026年最新统计",
    localCurrency: "人民币",
    localPrice: 26,
    localPriceFormatted: "¥26.00",
    region: "亚洲",
    usdPrice: 3.66,
    valuationPct: Math.round(((3.66 / usPrice) - 1) * 1000) / 10,
  },
  {
    country: "日本",
    countryCode: "JP",
    dataDate: "2026年最新统计",
    localCurrency: "日元",
    localPrice: 500,
    localPriceFormatted: "¥500",
    region: "亚洲",
    usdPrice: 3.35,
    valuationPct: Math.round(((3.35 / usPrice) - 1) * 1000) / 10,
  },
];

/**
 * Sorted by USD price descending (most expensive first).
 */
export const sortedByUsdPrice = bigmac.toSorted((a, b) => b.usdPrice - a.usdPrice);

/**
 * Sorted by valuation % descending (most overvalued first).
 */
export const sortedByValuation = bigmac.toSorted((a, b) => b.valuationPct - a.valuationPct);

export const regions = ["全部", "亚洲", "欧洲", "大洋洲", "北美"] as const;
