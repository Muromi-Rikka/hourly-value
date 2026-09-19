export interface ModelYEntry {
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

// 汇率从 wages.ts 推导（cnyEquivalent / localWage）
// EUR 7.87~7.92, GBP 9.09, USD 7.18, CAD 5.25, AUD 4.73, NZD 4.32, JPY 0.0468, KRW 0.00477

export const modelys: ModelYEntry[] = [
  {
    cnyEquivalent: 249_900,
    country: "中国",
    countryCode: "CN",
    localCurrency: "人民币",
    localPrice: 249_900,
    region: "亚洲",
    source: "特斯拉中国官网",
    sourceUrl: "https://www.tesla.cn/model-y",
    taxNote: "含13%增值税",
  },
  {
    cnyEquivalent: 323_604,
    country: "美国",
    countryCode: "US",
    localCurrency: "美元",
    localPrice: 44_990,
    region: "北美",
    source: "特斯拉美国官网",
    sourceUrl: "https://www.tesla.com/model-y",
    taxNote: "不含州税",
  },
  {
    cnyEquivalent: 262_448,
    country: "加拿大",
    countryCode: "CA",
    localCurrency: "加元",
    localPrice: 49_990,
    region: "北美",
    source: "特斯拉加拿大官网",
    sourceUrl: "https://www.tesla.com/en_ca/model-y",
    taxNote: "不含省税",
  },
  {
    cnyEquivalent: 322_591,
    country: "德国",
    countryCode: "DE",
    localCurrency: "欧元",
    localPrice: 40_990,
    region: "欧洲",
    source: "特斯拉德国官网",
    sourceUrl: "https://www.tesla.com/de_de/model-y",
    taxNote: "含19%增值税",
  },
  {
    cnyEquivalent: 323_447,
    country: "法国",
    countryCode: "FR",
    localCurrency: "欧元",
    localPrice: 40_990,
    region: "欧洲",
    source: "特斯拉法国官网",
    sourceUrl: "https://www.tesla.com/fr_fr/model-y",
    taxNote: "含20%增值税",
  },
  {
    cnyEquivalent: 322_798,
    country: "荷兰",
    countryCode: "NL",
    localCurrency: "欧元",
    localPrice: 40_990,
    region: "欧洲",
    source: "特斯拉荷兰官网",
    sourceUrl: "https://www.tesla.com/nl_nl/model-y",
    taxNote: "含21%增值税",
  },
  {
    cnyEquivalent: 322_711,
    country: "卢森堡",
    countryCode: "LU",
    localCurrency: "欧元",
    localPrice: 40_990,
    region: "欧洲",
    source: "特斯拉卢森堡官网",
    sourceUrl: "https://www.tesla.com/lu_lu/model-y",
    taxNote: "含17%增值税",
  },
  {
    cnyEquivalent: 324_641,
    country: "西班牙",
    countryCode: "ES",
    localCurrency: "欧元",
    localPrice: 40_990,
    region: "欧洲",
    source: "特斯拉西班牙官网",
    sourceUrl: "https://www.tesla.com/es_es/model-y",
    taxNote: "含21%增值税",
  },
  {
    cnyEquivalent: 409_089,
    country: "英国",
    countryCode: "GB",
    localCurrency: "英镑",
    localPrice: 44_990,
    region: "欧洲",
    source: "特斯拉英国官网",
    sourceUrl: "https://www.tesla.com/en_gb/model-y",
    taxNote: "含20%增值税",
  },
  {
    cnyEquivalent: 264_407,
    country: "澳大利亚",
    countryCode: "AU",
    localCurrency: "澳元",
    localPrice: 55_900,
    region: "大洋洲",
    source: "特斯拉澳大利亚官网",
    sourceUrl: "https://www.tesla.com/en_au/model-y",
    taxNote: "含10% GST",
  },
  {
    cnyEquivalent: 284_619,
    country: "新西兰",
    countryCode: "NZ",
    localCurrency: "新西兰元",
    localPrice: 65_900,
    region: "大洋洲",
    source: "特斯拉新西兰官网",
    sourceUrl: "https://www.tesla.com/en_nz/model-y",
    taxNote: "含15% GST",
  },
  {
    cnyEquivalent: 263_811,
    country: "日本",
    countryCode: "JP",
    localCurrency: "日元",
    localPrice: 5_637_000,
    region: "亚洲",
    source: "特斯拉日本官网",
    sourceUrl: "https://www.tesla.com/ja_jp/model-y",
    taxNote: "含10%消费税",
  },
  {
    cnyEquivalent: 252_797,
    country: "韩国",
    countryCode: "KR",
    localCurrency: "韩元",
    localPrice: 52_990_000,
    region: "亚洲",
    source: "特斯拉韩国官网",
    sourceUrl: "https://www.tesla.com/ko_kr/model-y",
    taxNote: "含增值税，不含地方电动车补贴",
  },
];

export const sortedByPrice = modelys.toSorted((a, b) => b.cnyEquivalent - a.cnyEquivalent);

export const regions = ["全部", "亚洲", "欧洲", "大洋洲", "北美"] as const;
