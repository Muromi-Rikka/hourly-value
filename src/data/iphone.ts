import { cnyPerUnit } from "@/data/exchange-rates";

export const IPHONE_SOURCE = {
  name: "Apple Store 各国官方商城",
  note: "iPhone 18 Pro 与 iPhone Duo 价格均取自 13 个国家/地区的 Apple 官方商城标价，各地区含税口径不同",
  url: "https://www.apple.com/shop/buy-iphone",
};

export interface IPhoneEntry {
  cnyEquivalent: number;
  country: string;
  countryCode: string;
  localCurrency: string;
  localPrice: number;
  region: "亚洲" | "北美" | "大洋洲" | "欧洲";
  source: string;
  sourceUrl: string;
  taxNote: string;
}

const rawIphones: Omit<IPhoneEntry, "cnyEquivalent">[] = [
  {
    country: "美国",
    countryCode: "US",
    localCurrency: "美元",
    localPrice: 1199,
    region: "北美",
    source: "Apple Store US 官方商城",
    sourceUrl: "https://www.apple.com/shop/buy-iphone",
    taxNote: "不含税",
  },
  {
    country: "加拿大",
    countryCode: "CA",
    localCurrency: "加元",
    localPrice: 1749,
    region: "北美",
    source: "Apple Store Canada 官方商城",
    sourceUrl: "https://www.apple.com/ca/shop/buy-iphone",
    taxNote: "不含税",
  },
  {
    country: "中国",
    countryCode: "CN",
    localCurrency: "人民币",
    localPrice: 9999,
    region: "亚洲",
    source: "Apple Store 中国官方商城",
    sourceUrl: "https://www.apple.com.cn/shop/buy-iphone",
    taxNote: "含13%增值税",
  },
  {
    country: "澳大利亚",
    countryCode: "AU",
    localCurrency: "澳元",
    localPrice: 2099,
    region: "大洋洲",
    source: "Apple Store 澳大利亚官方商城",
    sourceUrl: "https://www.apple.com/au/shop/buy-iphone",
    taxNote: "含10% GST",
  },
  {
    country: "日本",
    countryCode: "JP",
    localCurrency: "日元",
    localPrice: 219800,
    region: "亚洲",
    source: "Apple Store 日本官方商城",
    sourceUrl: "https://www.apple.com/jp/shop/buy-iphone",
    taxNote: "含10%消费税",
  },
  {
    country: "韩国",
    countryCode: "KR",
    localCurrency: "韩元",
    localPrice: 1990000,
    region: "亚洲",
    source: "Apple Store 韩国官方商城",
    sourceUrl: "https://www.apple.com/kr/shop/buy-iphone",
    taxNote: "含10%增值税",
  },
  {
    country: "新西兰",
    countryCode: "NZ",
    localCurrency: "新西兰元",
    localPrice: 2549,
    region: "大洋洲",
    source: "Apple Store 新西兰官方商城",
    sourceUrl: "https://www.apple.com/nz/shop/buy-iphone",
    taxNote: "含15% GST",
  },
  {
    country: "英国",
    countryCode: "GB",
    localCurrency: "英镑",
    localPrice: 1199,
    region: "欧洲",
    source: "Apple Store 英国官方商城",
    sourceUrl: "https://www.apple.com/uk/shop/buy-iphone",
    taxNote: "含20% VAT",
  },
  {
    country: "卢森堡",
    countryCode: "LU",
    localCurrency: "欧元",
    localPrice: 1430.1,
    region: "欧洲",
    source: "Apple Store 卢森堡官方商城",
    sourceUrl: "https://www.apple.com/lu/shop/buy-iphone",
    taxNote: "含17% VAT",
  },
  {
    country: "德国",
    countryCode: "DE",
    localCurrency: "欧元",
    localPrice: 1449,
    region: "欧洲",
    source: "Apple Store 德国官方商城",
    sourceUrl: "https://www.apple.com/de/shop/buy-iphone",
    taxNote: "含19% VAT",
  },
  {
    country: "法国",
    countryCode: "FR",
    localCurrency: "欧元",
    localPrice: 1479,
    region: "欧洲",
    source: "Apple Store 法国官方商城",
    sourceUrl: "https://www.apple.com/fr/shop/buy-iphone",
    taxNote: "含20% VAT",
  },
  {
    country: "西班牙",
    countryCode: "ES",
    localCurrency: "欧元",
    localPrice: 1469,
    region: "欧洲",
    source: "Apple Store 西班牙官方商城",
    sourceUrl: "https://www.apple.com/es/shop/buy-iphone",
    taxNote: "含21% VAT",
  },
  {
    country: "荷兰",
    countryCode: "NL",
    localCurrency: "欧元",
    localPrice: 1479,
    region: "欧洲",
    source: "Apple Store 荷兰官方商城",
    sourceUrl: "https://www.apple.com/nl/shop/buy-iphone",
    taxNote: "含21% VAT",
  },
];

/**
 * 人民币折算使用构建时拉取的最新汇率（scripts/fetch-rates.mjs）。
 */
export const iphones: IPhoneEntry[] = rawIphones.map(entry => ({
  ...entry,
  cnyEquivalent: Math.round(entry.localPrice * cnyPerUnit[entry.localCurrency]),
}));

export const sortedByPrice = iphones.toSorted((a, b) => b.cnyEquivalent - a.cnyEquivalent);

export const regions = ["全部", "亚洲", "欧洲", "大洋洲", "北美"] as const;
