/**
 * 各国常见生活物资零售价格（USD）
 * 数据来源：GlobalProductPrices.com · 2026年1月
 *
 * 注意：卢森堡（LU）在该网站无数据，已排除。
 */

export const COMMODITY_SOURCE = {
  date: "2026年1月",
  name: "GlobalProductPrices.com",
  note: "卢森堡（LU）在该站无数据，已排除",
  url: "https://www.globalproductprices.com/indicators_list.php",
};

export interface CommodityItem {
  beef1kg: number;
  chicken1kg: number;
  country: string;
  countryCode: string;
  /**
   * 鸡蛋 12个（中等大小）价格
   */
  eggs12: number;
  /**
   * 面粉 1kg（小麦面粉）
   */
  flour1kg: number;
  /**
   * 牛奶 1L（脂肪含量1.5-2.5%）
   */
  milk1l: number;
  /**
   * 食用油 1L（常用烹饪油）
   */
  oil1l: number;
  region: "亚洲" | "北美" | "大洋洲" | "欧洲";
  /**
   * 大米 1kg
   */
  rice1kg: number;
  /**
   * 食盐 1kg（加碘盐）
   */
  salt1kg: number;
  /**
   * 食糖 1kg（白砂糖）
   */
  sugar1kg: number;
}

export const commodities: CommodityItem[] = [
  {
    beef1kg: 17.78,
    chicken1kg: 4.62,
    country: "澳大利亚",
    countryCode: "AU",
    eggs12: 7.1,
    flour1kg: 1,
    milk1l: 2.17,
    oil1l: 7.11,
    region: "大洋洲",
    rice1kg: 2.28,
    salt1kg: 2.13,
    sugar1kg: 1.28,
  },
  {
    beef1kg: 36.74,
    chicken1kg: 15.5,
    country: "德国",
    countryCode: "DE",
    eggs12: 4.53,
    flour1kg: 1.71,
    milk1l: 2.05,
    oil1l: 5.17,
    region: "欧洲",
    rice1kg: 2.98,
    salt1kg: 2.07,
    sugar1kg: 1.15,
  },
  {
    beef1kg: 20.2,
    chicken1kg: 9.07,
    country: "法国",
    countryCode: "FR",
    eggs12: 4.19,
    flour1kg: 1.48,
    milk1l: 1.53,
    oil1l: 3.21,
    region: "欧洲",
    rice1kg: 2.07,
    salt1kg: 1.38,
    sugar1kg: 1.15,
  },
  {
    beef1kg: 24.8,
    chicken1kg: 9.53,
    country: "荷兰",
    countryCode: "NL",
    eggs12: 3.39,
    flour1kg: 1.62,
    milk1l: 1.48,
    oil1l: 1.61,
    region: "欧洲",
    rice1kg: 2.64,
    salt1kg: 0.92,
    sugar1kg: 1.03,
  },
  {
    beef1kg: 24.72,
    chicken1kg: 4.01,
    country: "英国",
    countryCode: "GB",
    eggs12: 4.81,
    flour1kg: 2.23,
    milk1l: 2.34,
    oil1l: 3.34,
    region: "欧洲",
    rice1kg: 1.74,
    salt1kg: 1.74,
    sugar1kg: 1.47,
  },
  {
    beef1kg: 17.77,
    chicken1kg: 5.62,
    country: "新西兰",
    countryCode: "NZ",
    eggs12: 6.87,
    flour1kg: 0.99,
    milk1l: 1.43,
    oil1l: 3.96,
    region: "大洋洲",
    rice1kg: 2.81,
    salt1kg: 1.03,
    sugar1kg: 2.18,
  },
  {
    beef1kg: 19.94,
    chicken1kg: 8.58,
    country: "加拿大",
    countryCode: "CA",
    eggs12: 2.81,
    flour1kg: 1.29,
    milk1l: 2.32,
    oil1l: 4.5,
    region: "北美",
    rice1kg: 3,
    salt1kg: 1.43,
    sugar1kg: 1.21,
  },
  {
    beef1kg: 18.8,
    chicken1kg: 9.9,
    country: "美国",
    countryCode: "US",
    eggs12: 4.62,
    flour1kg: 3.29,
    milk1l: 3.31,
    oil1l: 5.8,
    region: "北美",
    rice1kg: 4.6,
    salt1kg: 3,
    sugar1kg: 1.9,
  },
  {
    beef1kg: 63.65,
    chicken1kg: 7.39,
    country: "韩国",
    countryCode: "KR",
    eggs12: 3.04,
    flour1kg: 1.22,
    milk1l: 3.42,
    oil1l: 5.28,
    region: "亚洲",
    rice1kg: 3.85,
    salt1kg: 1.72,
    sugar1kg: 1.81,
  },
  {
    beef1kg: 37.51,
    chicken1kg: 7.47,
    country: "日本",
    countryCode: "JP",
    eggs12: 3,
    flour1kg: 2.41,
    milk1l: 1.86,
    oil1l: 6.64,
    region: "亚洲",
    rice1kg: 5.5,
    salt1kg: 2.41,
    sugar1kg: 2.73,
  },
  {
    beef1kg: 22.39,
    chicken1kg: 4.48,
    country: "西班牙",
    countryCode: "ES",
    eggs12: 3.73,
    flour1kg: 1.76,
    milk1l: 1.32,
    oil1l: 3.33,
    region: "欧洲",
    rice1kg: 1.95,
    salt1kg: 0.69,
    sugar1kg: 1.15,
  },
  {
    beef1kg: 22.07,
    chicken1kg: 5.96,
    country: "中国",
    countryCode: "CN",
    eggs12: 2.33,
    flour1kg: 2.06,
    milk1l: 2.09,
    oil1l: 2.8,
    region: "亚洲",
    rice1kg: 1.25,
    salt1kg: 1.49,
    sugar1kg: 2.65,
  },
];

export const regions = ["全部", "亚洲", "欧洲", "大洋洲", "北美"] as const;
