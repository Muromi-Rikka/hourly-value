import { cnyPerUnit } from "@/data/exchange-rates";

export const MODELY_SOURCE = {
  name: "Tesla 各国官网",
  note: "Model Y 后驱版标价取自 13 个国家/地区的特斯拉官网，各地区含税口径不同",
  url: "https://www.tesla.com/model-y",
};

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

const rawModelys: Omit<ModelYEntry, "cnyEquivalent">[] = [
  {
    country: "中国",
    countryCode: "CN",
    localCurrency: "人民币",
    localPrice: 249_900,
    region: "亚洲",
    source: "特斯拉中国官网",
    sourceUrl: "https://www.tesla.cn/modely",
    taxNote: "含13%增值税",
  },
  {
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

/**
 * 人民币折算使用构建时拉取的最新汇率（scripts/fetch-rates.mjs）。
 */
export const modelys: ModelYEntry[] = rawModelys.map(entry => ({
  ...entry,
  cnyEquivalent: Math.round(entry.localPrice * cnyPerUnit[entry.localCurrency]),
}));

export const sortedByPrice = modelys.toSorted((a, b) => b.cnyEquivalent - a.cnyEquivalent);

export const regions = ["全部", "亚洲", "欧洲", "大洋洲", "北美"] as const;
