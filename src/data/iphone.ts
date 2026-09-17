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

// 汇率参考：2026年9月近似值
// USD 7.25, CAD 5.35, JPY 0.048, KRW 0.0053, AUD 4.75, NZD 4.35, GBP 9.25, EUR 7.85

export const iphones: IPhoneEntry[] = [
  {
    cnyEquivalent: 8693,
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
    cnyEquivalent: 9357,
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
    cnyEquivalent: 9999,
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
    cnyEquivalent: 9970,
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
    cnyEquivalent: 10550,
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
    cnyEquivalent: 10547,
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
    cnyEquivalent: 11088,
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
    cnyEquivalent: 11091,
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
    cnyEquivalent: 11226,
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
    cnyEquivalent: 11375,
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
    cnyEquivalent: 11610,
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
    cnyEquivalent: 11532,
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
    cnyEquivalent: 11610,
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

export const sortedByPrice = iphones.toSorted((a, b) => b.cnyEquivalent - a.cnyEquivalent);

export const regions = ["全部", "亚洲", "欧洲", "大洋洲", "北美"] as const;
