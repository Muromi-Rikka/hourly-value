import type { Region } from "@/lib/region";

import { cnyPerUnit } from "@/data/exchange-rates";
import { DASH, round1, round2 } from "@/lib/format";

/**
 * 当地最低工资的公布单位，决定时薪是如何得到的
 */
export type HoursBasis = "day" | "hour" | "month" | "week";

/**
 * 工资换算口径：
 * - `hourly`：以各国官方公布的法定最低时薪为基准；只设月/日/周薪的国家按来源写明的工时折算。
 * - `monthly`：以官方最低月工资为基准，除以月工时（法定周工时 × 52 / 12）折算为时薪。
 *
 * 只设时薪的国家两口径相等（月薪由时薪推算）；设月薪的国家两口径可能不同，
 * 差异来源正是「官方公布的折算工时」与「法定周工时 × 52 / 12」不一致。
 */
export type WageCaliber = "hourly" | "monthly";

export const CALIBER_LABEL: Record<WageCaliber, string> = {
  hourly: "官方时薪口径",
  monthly: "月薪折算口径",
};

export const CALIBER_NOTE: Record<WageCaliber, string> = {
  hourly: "以各国官方公布的法定最低时薪为基准；只设月/日/周薪的国家，按来源写明的工时折算成时薪。",
  monthly: "以官方最低月工资 ÷ 月工时（法定周工时 × 52 / 12）折算时薪；不设月薪的国家，月薪由时薪推算，故两口径相等。",
};

export interface WageEntry {
  cnyEquivalent: number;
  /**
   * 月薪折算口径的人民币时薪 = cnyMonthly / monthlyHours
   */
  cnyHourFromMonthly: number;
  /**
   * 展示用人民币月薪（官方月薪，或由时薪推算）
   */
  cnyMonthly: number;
  country: string;
  countryCode: string;
  effectiveDate: string;
  /**
   * 公布单位：按月/按日设定的国家，时薪由月或日工资换算而来
   */
  hoursBasis: HoursBasis;
  /**
   * 是否为代理值：无全国统一标准时取地区中位数、集体协议口径或首都区档位
   */
  isProxy: boolean;
  localCurrency: string;
  /**
   * 展示用本币月薪：有官方月薪用官方值，否则由时薪推算
   */
  localMonthly: number;
  /**
   * 本币月薪单位，如「欧元/月」
   */
  localMonthlyUnit: string;
  localUnit: string;
  localWage: number;
  /**
   * 月薪折算口径的本币时薪 = localMonthly / monthlyHours
   */
  localWageFromMonthly: number;
  /**
   * 月工时 = 法定周工时 × 52 / 12
   */
  monthlyHours: number;
  /**
   * 月薪来源机构（推算时与时薪来源相同）
   */
  monthlySource: string;
  monthlySourceUrl: string;
  /**
   * 官方公布的最低月工资（本币、全职税前）；null = 该国无法定月薪，月薪由时薪推算
   */
  monthlyWage: null | number;
  /**
   * true = 该国无法定月薪，展示的月薪由时薪 × 月工时推算而来
   */
  monthlyWageIsDerived: boolean;
  note: string;
  region: Region;
  source: string;
  sourceUrl: string;
  /**
   * 换算时薪所用的工时数（`note` 中明确写出的数字）；按小时公布时为 null
   */
  statutoryHours: null | number;
  /**
   * 法定周工时；本项目所有国家均填写，作为月工时的唯一依据
   */
  statutoryWeeklyHours: number;
  /**
   * 法定周工时来源机构
   */
  weeklyHoursSource: string;
  weeklyHoursSourceUrl: string;
}

/**
 * 记录原始值时省略由代码派生的字段，避免手抄不一致
 */
type RawWage = Omit<
  WageEntry,
  | "cnyEquivalent"
  | "cnyHourFromMonthly"
  | "cnyMonthly"
  | "localMonthly"
  | "localMonthlyUnit"
  | "localWageFromMonthly"
  | "monthlyHours"
  | "monthlyWageIsDerived"
>;

const rawWages: RawWage[] = [
  {
    country: "澳大利亚",
    countryCode: "AU",
    effectiveDate: "2026-07-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "澳元",
    localUnit: "澳元/小时",
    localWage: 26.44,
    monthlySource: "Fair Work Commission",
    monthlySourceUrl: "https://www.fwc.gov.au/work-conditions/minimum-wages-and-conditions/national-minimum-wage",
    monthlyWage: null,
    note: "全国统一最低工资，官方按周/时公布（1004.90 澳元/周 ÷ 38 小时 = 26.44 澳元/时）；多数雇员另有行业 award 标准",
    region: "大洋洲",
    source: "Fair Work Commission / 公平工作监察署 FWO",
    sourceUrl: "https://www.fwc.gov.au/work-conditions/minimum-wages-and-conditions/national-minimum-wage",
    statutoryHours: null,
    statutoryWeeklyHours: 38,
    weeklyHoursSource: "Fair Work Commission（全国最低工资以 38 小时/周为基准）",
    weeklyHoursSourceUrl: "https://www.fwc.gov.au/work-conditions/minimum-wages-and-conditions/national-minimum-wage",
  },
  {
    country: "卢森堡",
    countryCode: "LU",
    effectiveDate: "2026-06-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 15.99,
    monthlySource: "卢森堡劳动与矿业监察局 ITM",
    monthlySourceUrl: "https://itm.public.lu/en/conditions-travail/salaires.html",
    monthlyWage: 2771.33,
    note: "全国统一社会最低工资 SSM（18 岁及以上非熟练岗 2771.33 欧元/月，随生活成本指数自动调整）；熟练岗为 120%",
    region: "欧洲",
    source: "卢森堡劳动与矿业监察局 ITM；Guichet.lu",
    sourceUrl: "https://itm.public.lu/en/conditions-travail/salaires.html",
    statutoryHours: 173.33,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "ITM（法定 40 小时/周）",
    weeklyHoursSourceUrl: "https://itm.public.lu/en/conditions-travail/duree-travail.html",
  },
  {
    country: "德国",
    countryCode: "DE",
    effectiveDate: "2026-01-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 13.9,
    monthlySource: "德国联邦劳动与社会事务部 BMAS",
    monthlySourceUrl: "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/Informationen-zum-Mindestlohn/informationen-zum-mindestlohn-deutsch.html",
    monthlyWage: null,
    note: "全国统一法定最低时薪；2027-01-01 起上调至 14.60 欧元。德国不设月度法定标准，月额按月工时推算",
    region: "欧洲",
    source: "德国联邦劳动与社会事务部 BMAS",
    sourceUrl: "https://www.bmas.de/DE/Arbeit/Arbeitsrecht/Mindestlohn/Informationen-zum-Mindestlohn/informationen-zum-mindestlohn-deutsch.html",
    statutoryHours: null,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《工作时间法》ArbZG 上限 48 小时/周；本项目取全职惯例 40 小时/周",
    weeklyHoursSourceUrl: "https://www.gesetze-im-internet.de/arbzg/BJNR117100994.html",
  },
  {
    country: "法国",
    countryCode: "FR",
    effectiveDate: "2026-06-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 12.31,
    monthlySource: "法国劳动部 / service-public.gouv.fr",
    monthlySourceUrl: "https://www.service-public.gouv.fr/particuliers/actualites/A17008",
    monthlyWage: 1867.02,
    note: "SMIC；法律定义为时薪，官方按月额 1867.02 欧元（35 小时/周，151.67 小时/月）同步公布",
    region: "欧洲",
    source: "法国劳动部 / service-public.gouv.fr",
    sourceUrl: "https://www.service-public.gouv.fr/particuliers/actualites/A17008",
    statutoryHours: null,
    statutoryWeeklyHours: 35,
    weeklyHoursSource: "法定 35 小时/周",
    weeklyHoursSourceUrl: "https://www.service-public.gouv.fr/particuliers/actualites/A17008",
  },
  {
    country: "荷兰",
    countryCode: "NL",
    effectiveDate: "2026-07-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 14.99,
    monthlySource: "荷兰社会事务与就业部 Rijksoverheid",
    monthlySourceUrl: "https://www.rijksoverheid.nl/themas/werk/minimumloon/bedragen-minimumloon/bedragen-minimumloon-2026",
    monthlyWage: null,
    note: "2024 年起仅设法定统一最低时薪（21 岁及以上）；荷兰已取消法定月最低工资，官方参考月额非法律最低值",
    region: "欧洲",
    source: "荷兰社会事务与就业部 Rijksoverheid",
    sourceUrl: "https://www.rijksoverheid.nl/themas/werk/minimumloon/bedragen-minimumloon/bedragen-minimumloon-2026",
    statutoryHours: null,
    statutoryWeeklyHours: 36,
    weeklyHoursSource: "Rijksoverheid 官方参考月额以 36 小时/周为基准",
    weeklyHoursSourceUrl: "https://www.rijksoverheid.nl/themas/werk/minimumloon/bedragen-minimumloon/bedragen-minimumloon-2026",
  },
  {
    country: "英国",
    countryCode: "GB",
    effectiveDate: "2026-04-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "英镑",
    localUnit: "英镑/小时",
    localWage: 12.71,
    monthlySource: "UK Government GOV.UK",
    monthlySourceUrl: "https://www.gov.uk/national-minimum-wage-rates",
    monthlyWage: null,
    note: "National Living Wage（21 岁及以上）；英国法律只设时薪、不设月度最低工资，月额按月工时推算",
    region: "欧洲",
    source: "UK Government GOV.UK",
    sourceUrl: "https://www.gov.uk/national-minimum-wage-rates",
    statutoryHours: null,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "法定周工时上限 48 小时；本项目取全职惯例 40 小时/周",
    weeklyHoursSourceUrl: "https://www.gov.uk/maximum-weekly-working-hours",
  },
  {
    country: "新西兰",
    countryCode: "NZ",
    effectiveDate: "2026-04-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "新西兰元",
    localUnit: "新西兰元/小时",
    localWage: 23.95,
    monthlySource: "新西兰商业、创新与就业部 MBIE",
    monthlySourceUrl: "https://www.employment.govt.nz/hours-and-wages/pay/minimum-wage/minimum-wage-rates",
    monthlyWage: null,
    note: "全国统一成人最低时薪（《最低工资令 2026》）；新西兰法律不设月度最低工资",
    region: "大洋洲",
    source: "新西兰商业、创新与就业部 MBIE",
    sourceUrl: "https://www.employment.govt.nz/hours-and-wages/pay/minimum-wage/minimum-wage-rates",
    statutoryHours: null,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《最低工资令 2026》以 40 小时/周为全职基准",
    weeklyHoursSourceUrl: "https://www.employment.govt.nz/hours-and-wages/pay/minimum-wage/minimum-wage-rates",
  },
  {
    country: "加拿大",
    countryCode: "CA",
    effectiveDate: "2026-10-01",
    hoursBasis: "hour",
    isProxy: true,
    localCurrency: "加元",
    localUnit: "加元/小时",
    localWage: 16.5,
    monthlySource: "加拿大就业与社会发展部 ESDC",
    monthlySourceUrl: "https://www.canada.ca/en/employment-social-development/news/2026/03/government-of-canada-raises-the-federal-minimum-wage.html",
    monthlyWage: null,
    note: "无联邦统一标准，各省独立立法；取各省现行时薪中位数，联邦监管行业为 18.15 加元/小时",
    region: "北美",
    source: "加拿大就业与社会发展部 ESDC；各省劳工厅",
    sourceUrl: "https://www.canada.ca/en/employment-social-development/news/2026/03/government-of-canada-raises-the-federal-minimum-wage.html",
    statutoryHours: null,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《加拿大劳工法典》法定 40 小时/周；各省为 40–48 小时",
    weeklyHoursSourceUrl: "https://www.canada.ca/en/services/jobs/workplace/federal-labour-standards/work-hours.html",
  },
  {
    country: "美国",
    countryCode: "US",
    effectiveDate: "2026-01-01",
    hoursBasis: "hour",
    isProxy: true,
    localCurrency: "美元",
    localUnit: "美元/小时",
    localWage: 11.63,
    monthlySource: "美国劳工部 DOL 工资与工时司",
    monthlySourceUrl: "https://www.dol.gov/agencies/whd/minimum-wage/state",
    monthlyWage: null,
    note: "联邦底线 7.25 美元，主要看州立法；取各州现行时薪中位数（35 个州及 DC 高于联邦底线）",
    region: "北美",
    source: "美国劳工部 DOL 工资与工时司",
    sourceUrl: "https://www.dol.gov/agencies/whd/minimum-wage/state",
    statutoryHours: null,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "FLSA 以 40 小时/周为加班门槛，无强制周上限",
    weeklyHoursSourceUrl: "https://www.dol.gov/agencies/whd/minimum-wage/state",
  },
  {
    country: "韩国",
    countryCode: "KR",
    effectiveDate: "2026-01-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "韩元",
    localUnit: "韩元/小时",
    localWage: 10320,
    monthlySource: "韩国最低工资委员会 / 雇佣劳动部",
    monthlySourceUrl: "https://www.minimumwage.go.kr/english/main.do",
    monthlyWage: 2156880,
    note: "全国统一法定最低时薪 10320 韩元；官方按月公示 2,156,880 韩元（时薪 × 209 小时，含周休津贴）",
    region: "亚洲",
    source: "韩国最低工资委员会 / 雇佣劳动部",
    sourceUrl: "https://www.minimumwage.go.kr/english/main.do",
    statutoryHours: null,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《劳动基准法》法定 40 小时/周",
    weeklyHoursSourceUrl: "https://elaw.klri.re.kr/eng_service/lawView.do?lang=ENG&hseq=68845",
  },
  {
    country: "日本",
    countryCode: "JP",
    effectiveDate: "2026-10-01",
    hoursBasis: "hour",
    isProxy: true,
    localCurrency: "日元",
    localUnit: "日元/小时",
    localWage: 1177,
    monthlySource: "日本厚生劳动省 MHLW",
    monthlySourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/minimumichiran/index.html",
    monthlyWage: null,
    note: "各县独立制定最低时薪，取 47 都道府县加权平均（FY2026）；日本不设月度最低工资",
    region: "亚洲",
    source: "日本厚生劳动省 MHLW",
    sourceUrl: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/minimumichiran/index.html",
    statutoryHours: null,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《劳动基准法》第 32 条法定 40 小时/周",
    weeklyHoursSourceUrl: "https://www.japaneselawtranslation.go.jp/en/laws/view/3567/en",
  },
  {
    country: "西班牙",
    countryCode: "ES",
    effectiveDate: "2026-01-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 7.63,
    monthlySource: "西班牙劳动部；BOE（RD 126/2026）",
    monthlySourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3815",
    monthlyWage: 1221,
    note: "按月设定最低工资（1221 欧元/月，14 薪制），时薪口径按 160 小时/月折算",
    region: "欧洲",
    source: "西班牙劳动部；BOE（RD 126/2026）",
    sourceUrl: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3815",
    statutoryHours: 160,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《劳动者法》第 34.1 条，年平均值 40 小时/周",
    weeklyHoursSourceUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430",
  },
  {
    country: "中国",
    countryCode: "CN",
    effectiveDate: "2026-01-01",
    hoursBasis: "month",
    isProxy: true,
    localCurrency: "人民币",
    localUnit: "元/小时",
    localWage: 13.33,
    monthlySource: "人社部《全国各省、自治区、直辖市最低工资标准情况》",
    monthlySourceUrl: "https://www.mohrss.gov.cn/SYrlzyhshbzb/laodongguanxi_/fwyd/",
    monthlyWage: 2320,
    note: "分省分档。月最低工资第一档中位数 2320 元，按官方月计薪天数 21.75 天（174 小时/月）折算时薪 13.33 元。各省另有独立的『非全日制小时最低工资』（第一档中位数 23 元/小时），属不同法律构造，不计入",
    region: "亚洲",
    source: "人社部《全国各省、自治区、直辖市最低工资标准情况》（截至 2026-01-01）",
    sourceUrl: "https://www.mohrss.gov.cn/SYrlzyhshbzb/laodongguanxi_/fwyd/",
    statutoryHours: 174,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "国务院《关于职工工作时间的规定》40 小时/周",
    weeklyHoursSourceUrl: "https://www.mohrss.gov.cn/SYrlzyhshbzb/laodongguanxi_/fwyd/",
  },
  {
    country: "印度",
    countryCode: "IN",
    effectiveDate: "2026-10-01",
    hoursBasis: "day",
    isProxy: true,
    localCurrency: "印度卢比",
    localUnit: "印度卢比/小时",
    localWage: 86.63,
    monthlySource: "印度劳工与就业部；首席劳工专员 CLC",
    monthlySourceUrl: "https://clc.gov.in/clc/",
    monthlyWage: null,
    note: "无全国统一最低工资；取中央管辖行业非技术工日薪 ₹693（介于 A 区 ₹840 与 C 区 ₹565 之间的居中档），按 8 小时/日折算",
    region: "亚洲",
    source: "印度劳工与就业部；首席劳工专员 (Central) CLC",
    sourceUrl: "https://clc.gov.in/clc/",
    statutoryHours: 8,
    statutoryWeeklyHours: 48,
    weeklyHoursSource: "《工资法典》中央规则，48 小时/周",
    weeklyHoursSourceUrl: "https://clc.gov.in/clc/",
  },
  {
    country: "墨西哥",
    countryCode: "MX",
    effectiveDate: "2026-01-01",
    hoursBasis: "day",
    isProxy: true,
    localCurrency: "墨西哥比索",
    localUnit: "墨西哥比索/小时",
    localWage: 39.38,
    monthlySource: "墨西哥全国最低工资委员会 CONASAMI",
    monthlySourceUrl: "https://www.gob.mx/conasami/articulos/incremento-a-los-salarios-minimos-para-2026?idiom=es",
    monthlyWage: null,
    note: "分一般区与北部边境自由区两档，取一般区日薪 315.04 比索，按 8 小时/日折算",
    region: "北美",
    source: "墨西哥全国最低工资委员会 CONASAMI",
    sourceUrl: "https://www.gob.mx/conasami/articulos/incremento-a-los-salarios-minimos-para-2026?idiom=es",
    statutoryHours: 8,
    statutoryWeeklyHours: 48,
    weeklyHoursSource: "《联邦劳动法》2026 年为 48 小时/周（2027 年起逐年降至 40）",
    weeklyHoursSourceUrl: "https://www.diputados.gob.mx/LeyesBiblio/ref/lft/LFT_ref52_01may26.pdf",
  },
  {
    country: "波兰",
    countryCode: "PL",
    effectiveDate: "2026-01-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "波兰兹罗提",
    localUnit: "波兰兹罗提/小时",
    localWage: 30.04,
    monthlySource: "波兰家庭、劳动与社会政策部 / 部长会议条例",
    monthlySourceUrl: "https://www.gov.pl/web/family/minimum-wage",
    monthlyWage: 4806,
    note: "全国统一月最低工资 4806 兹罗提（brutto），时薪口径按 160 小时/月折算；另有适用于民事合同的最低时薪 31.40 兹罗提",
    region: "欧洲",
    source: "波兰家庭、劳动与社会政策部（Dz.U. 2025 poz. 1242）",
    sourceUrl: "https://www.gov.pl/web/family/minimum-wage",
    statutoryHours: 160,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《劳动法典》第 129 条，40 小时/周",
    weeklyHoursSourceUrl: "https://www.gov.pl/web/your-europe/working-time-setting-and-settlement",
  },
  {
    country: "马来西亚",
    countryCode: "MY",
    effectiveDate: "2025-02-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "马来西亚林吉特",
    localUnit: "马来西亚林吉特/小时",
    localWage: 8.72,
    monthlySource: "马来西亚人力资源部 KESUMA",
    monthlySourceUrl: "https://gajiminimum.mohr.gov.my/wp-content/uploads/PUA%20376.pdf",
    monthlyWage: 1700,
    note: "全国统一月最低工资 1700 林吉特；法令同时公布时薪 8.72 林吉特（按 45 小时/周折算，两口径一致）",
    region: "亚洲",
    source: "马来西亚人力资源部《2024 年最低工资法令》P.U.(A) 376/2024",
    sourceUrl: "https://gajiminimum.mohr.gov.my/wp-content/uploads/PUA%20376.pdf",
    statutoryHours: null,
    statutoryWeeklyHours: 45,
    weeklyHoursSource: "《雇佣法》修正后 45 小时/周",
    weeklyHoursSourceUrl: "https://www.malaysia.gov.my/en/topics/labour-law",
  },
  {
    country: "泰国",
    countryCode: "TH",
    effectiveDate: "2025-07-01",
    hoursBasis: "day",
    isProxy: true,
    localCurrency: "泰铢",
    localUnit: "泰铢/小时",
    localWage: 44.63,
    monthlySource: "泰国劳工部工资委员会",
    monthlySourceUrl: "https://www.mol.go.th/en/news/starting-july-1-ministry-of-labour-revises-minimum-wage-to-align-with-economy-and-improve-workers-quality-of-life",
    monthlyWage: null,
    note: "按工资委员会第 14 号公告分 17 档（337–400 铢），取居中档 357 泰铢/日，按 8 小时/日折算",
    region: "亚洲",
    source: "泰国劳工部工资委员会《最低工资率公告（第 14 号）》",
    sourceUrl: "https://www.mol.go.th/en/news/starting-july-1-ministry-of-labour-revises-minimum-wage-to-align-with-economy-and-improve-workers-quality-of-life",
    statutoryHours: 8,
    statutoryWeeklyHours: 48,
    weeklyHoursSource: "《劳动保护法》B.E. 2541，48 小时/周",
    weeklyHoursSourceUrl: "https://library.siam-legal.com/thai-law/labor-protection-act-employer-sections-23-37",
  },
  {
    country: "比利时",
    countryCode: "BE",
    effectiveDate: "2026-07-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 13.96,
    monthlySource: "比利时全国劳动委员会 CNT/NAR（CCT n°43）",
    monthlySourceUrl: "https://cnt-nar.be/fr/dossiers-thematiques/salaire-minimum",
    monthlyWage: 2233.61,
    note: "全国性集体协议（CCT n°43）保证平均最低月收入 2233.61 欧元，时薪口径按 160 小时/月折算；按法定 38 小时/周口径约 13.56 欧元",
    region: "欧洲",
    source: "比利时全国劳动委员会 CNT/NAR（CCT n°43）",
    sourceUrl: "https://cnt-nar.be/fr/dossiers-thematiques/salaire-minimum",
    statutoryHours: 160,
    statutoryWeeklyHours: 38,
    weeklyHoursSource: "法定 38 小时/周",
    weeklyHoursSourceUrl: "https://employment.belgium.be/en/themes/international/posting/working-conditions-be-respected-case-posting-belgium/working-time-and",
  },
  {
    country: "葡萄牙",
    countryCode: "PT",
    effectiveDate: "2026-01-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 5.75,
    monthlySource: "葡萄牙政府 / 《劳动法典》RMMG",
    monthlySourceUrl: "https://portugal.gov.pt/gc25/comunicacao/noticias/governo-aumenta-salario-minimo-para-920-euros-em-2026",
    monthlyWage: 920,
    note: "全国统一（大陆地区）月最低工资 920 欧元（RMMG），时薪口径按 160 小时/月折算；全年付 14 薪，自治区标准更高",
    region: "欧洲",
    source: "葡萄牙政府（2026 年 RMMG 920 欧元）",
    sourceUrl: "https://portugal.gov.pt/gc25/comunicacao/noticias/governo-aumenta-salario-minimo-para-920-euros-em-2026",
    statutoryHours: 160,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《劳动法典》第 203 条，40 小时/周",
    weeklyHoursSourceUrl: "https://ec.europa.eu/social/BlobServlet?docId=2364&langId=en",
  },
  {
    country: "爱尔兰",
    countryCode: "IE",
    effectiveDate: "2026-01-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 14.15,
    monthlySource: "爱尔兰工作关系委员会 WRC",
    monthlySourceUrl: "https://www.workplacerelations.ie/en/what_you_should_know/hours-and-wages/national%20minimum%20wage",
    monthlyWage: null,
    note: "全国统一法定时薪（20 岁及以上）；爱尔兰不设月度法定标准，月额按 39 小时/周推算",
    region: "欧洲",
    source: "爱尔兰工作关系委员会 WRC",
    sourceUrl: "https://www.workplacerelations.ie/en/what_you_should_know/hours-and-wages/national%20minimum%20wage",
    statutoryHours: null,
    statutoryWeeklyHours: 39,
    weeklyHoursSource: "无全职工时定义；Eurostat 与财政部采用 39 小时/周",
    weeklyHoursSourceUrl: "https://www.workplacerelations.ie/en/what_you_should_know/hours-and-wages/national%20minimum%20wage",
  },
  {
    country: "希腊",
    countryCode: "GR",
    effectiveDate: "2026-04-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "欧元",
    localUnit: "欧元/小时",
    localWage: 5.75,
    monthlySource: "希腊劳工与社会庇护部（部长决定 8934/2026）",
    monthlySourceUrl: "https://ypergasias.gov.gr/en/labour-relations/collective-employment-relations/minimum-wage",
    monthlyWage: 920,
    note: "全国统一全职雇员月最低工资 920 欧元，时薪口径按 160 小时/月折算；全年付 14 薪",
    region: "欧洲",
    source: "希腊劳工与社会庇护部（共同部长级决定 8934/2026）",
    sourceUrl: "https://ypergasias.gov.gr/en/labour-relations/collective-employment-relations/minimum-wage",
    statutoryHours: 160,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "法定 40 小时/周",
    weeklyHoursSourceUrl: "https://ypergasias.gov.gr/en/labour-relations/individual-employment-relations/working-time-limits/",
  },
  {
    country: "菲律宾",
    countryCode: "PH",
    effectiveDate: "2026-09-26",
    hoursBasis: "day",
    isProxy: true,
    localCurrency: "菲律宾比索",
    localUnit: "菲律宾比索/小时",
    localWage: 94.38,
    monthlySource: "菲律宾劳工就业部 DOLE / NWPC",
    monthlySourceUrl: "https://nwpc.dole.gov.ph/",
    monthlyWage: null,
    note: "无全国统一时薪，按地区工资委员会分区设定；取首都区（NCR）非农业部门日薪 755 比索（工资令 NCR-28），按 8 小时/日折算",
    region: "亚洲",
    source: "菲律宾劳工就业部 DOLE；国家工资与生产力委员会 NWPC",
    sourceUrl: "https://nwpc.dole.gov.ph/",
    statutoryHours: 8,
    statutoryWeeklyHours: 48,
    weeklyHoursSource: "《劳动法典》第 83 条，48 小时/周（六日制）",
    weeklyHoursSourceUrl: "https://chanrobles.com/legal4labor3.htm",
  },
  {
    country: "捷克",
    countryCode: "CZ",
    effectiveDate: "2026-01-01",
    hoursBasis: "hour",
    isProxy: false,
    localCurrency: "捷克克朗",
    localUnit: "捷克克朗/小时",
    localWage: 134.4,
    monthlySource: "捷克劳工与社会事务部 MPSV",
    monthlySourceUrl: "https://mpsv.gov.cz/minimalni-mzda",
    monthlyWage: 22400,
    note: "全国统一，法定时薪 134.40 克朗；官方月最低工资 22400 克朗（40 小时/周）。两个官方口径按不同工时折出，故折算时薪不同",
    region: "欧洲",
    source: "捷克劳工与社会事务部 MPSV（sdělení č. 356/2025 Sb.）",
    sourceUrl: "https://mpsv.gov.cz/minimalni-mzda",
    statutoryHours: null,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "法定 40 小时/周",
    weeklyHoursSourceUrl: "https://mpsv.gov.cz/minimalni-mzda",
  },
  {
    country: "匈牙利",
    countryCode: "HU",
    effectiveDate: "2026-01-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "匈牙利福林",
    localUnit: "匈牙利福林/小时",
    localWage: 2017.5,
    monthlySource: "匈牙利政府令第 426/2025 (XII. 23.) 号",
    monthlySourceUrl: "https://njt.jog.gov.hu/jogszabaly/2025-426-20-22",
    monthlyWage: 322800,
    note: "全国统一（非熟练岗 minimálbér），月最低工资 322800 福林，时薪口径按 160 小时/月折算；需学历的保障工资为 373200 福林/月",
    region: "欧洲",
    source: "匈牙利政府令第 426/2025 (XII. 23.) 号",
    sourceUrl: "https://njt.jog.gov.hu/jogszabaly/2025-426-20-22",
    statutoryHours: 160,
    statutoryWeeklyHours: 40,
    weeklyHoursSource: "《劳动法典》标准 40 小时/周",
    weeklyHoursSourceUrl: "https://www.eurofound.europa.eu/en/countries/hungary/working-time",
  },
  {
    country: "智利",
    countryCode: "CL",
    effectiveDate: "2026-05-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "智利比索",
    localUnit: "智利比索/小时",
    localWage: 3041.54,
    monthlySource: "智利劳动局（DT）；第 21.830 号法",
    monthlySourceUrl: "https://www.dt.gob.cl/portal/1626/w3-article-60141.html",
    monthlyWage: 553553,
    note: "全国统一，月最低收入 553553 比索（18–65 岁），按 2026 年起法定周工时 42 小时折算月工时 182 小时",
    region: "南美",
    source: "智利劳动与社会福利部（DT）；第 21.830 号法",
    sourceUrl: "https://www.dt.gob.cl/portal/1626/w3-article-60141.html",
    statutoryHours: 182,
    statutoryWeeklyHours: 42,
    weeklyHoursSource: "第 21.561 号法，自 2026-04-26 起 42 小时/周",
    weeklyHoursSourceUrl: "https://www.mintrab.gob.cl/40horas",
  },
  {
    country: "以色列",
    countryCode: "IL",
    effectiveDate: "2026-04-01",
    hoursBasis: "month",
    isProxy: false,
    localCurrency: "新谢克尔",
    localUnit: "新谢克尔/小时",
    localWage: 34.64,
    monthlySource: "以色列国家保险协会 / 劳动部",
    monthlySourceUrl: "https://www.btl.gov.il/English%20Homepage/Mediniyut/GeneralInformation/Pages/MinimumWage.aspx",
    monthlyWage: 6443.85,
    note: "全国统一，月最低工资 6443.85 新谢克尔，时薪口径按官方 186 小时/月基准折算；按法定 42 小时/周折算则约 35.41",
    region: "中东",
    source: "以色列国家保险协会《最低工资》；《最低工资法》5747-1987",
    sourceUrl: "https://www.btl.gov.il/English%20Homepage/Mediniyut/GeneralInformation/Pages/MinimumWage.aspx",
    statutoryHours: 186,
    statutoryWeeklyHours: 42,
    weeklyHoursSource: "标准 42 小时/周",
    weeklyHoursSourceUrl: "https://www.gov.il/en/pages/overtime-and-extra-hours",
  },
];

/**
 * 人民币折算使用构建时拉取的最新汇率（scripts/fetch-rates.mjs）。
 * 保留 1 位小数：低工资国家取整后误差可达数个百分点。
 */
function derive(entry: RawWage): WageEntry {
  const rate = cnyPerUnit[entry.localCurrency] ?? 1;
  const monthlyHours = round2(entry.statutoryWeeklyHours * 52 / 12);
  // 无法定月薪时，月薪由时薪推算；两口径因此相等，是设计而非巧合
  const localMonthly = entry.monthlyWage ?? round2(entry.localWage * monthlyHours);
  const localWageFromMonthly = round2(localMonthly / monthlyHours);

  return {
    ...entry,
    cnyEquivalent: round1(entry.localWage * rate),
    cnyHourFromMonthly: round1(localWageFromMonthly * rate),
    cnyMonthly: round1(localMonthly * rate),
    localMonthly,
    localMonthlyUnit: entry.localUnit.replace("/小时", "/月"),
    localWageFromMonthly,
    monthlyHours,
    monthlyWageIsDerived: entry.monthlyWage === null,
  };
}

export const wages: WageEntry[] = rawWages.map(entry => derive(entry));

export const sortedByWage = wages.toSorted((a, b) => b.cnyEquivalent - a.cnyEquivalent);

const wageByCode = new Map(wages.map(entry => [entry.countryCode, entry]));

/**
 * 工资公布单位 → 中文口径说明。
 * 全站唯一实现：`/hourly` 与工资 explore 页共用，避免同一句口径写两遍。
 */
export function basisLabel(basis: HoursBasis, statutoryHours: null | number): string {
  switch (basis) {
    case "day": {
      return `按日薪折算（每天 ${statutoryHours ?? DASH} 小时）`;
    }
    case "hour": {
      return "官方直接公布时薪";
    }
    case "month": {
      return `按月薪折算（每月 ${statutoryHours ?? DASH} 小时）`;
    }
    case "week": {
      return `按周薪折算（每周 ${statutoryHours ?? DASH} 小时）`;
    }
  }
}

/**
 * 月薪口径 → 中文口径说明。与 `basisLabel` 并列的唯一实现。
 */
export function monthlyBasisLabel(
  entry: Pick<WageEntry, "monthlyHours" | "monthlyWageIsDerived" | "statutoryWeeklyHours">,
): string {
  const hours = `${round1(entry.monthlyHours)} 小时/月，法定每周 ${entry.statutoryWeeklyHours} 小时`;
  return entry.monthlyWageIsDerived
    ? `月薪由时薪推算（时薪 × ${hours}）`
    : `按官方月薪折算（月薪 ÷ ${hours}）`;
}

/**
 * 按 ISO 国家码取工资记录
 */
export function wageBy(countryCode: string): undefined | WageEntry {
  return wageByCode.get(countryCode);
}
