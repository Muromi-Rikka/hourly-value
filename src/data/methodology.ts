import { commonCodes, hourlyPower } from "@/data/hourly-power";

export interface MethodNote {
  body: string;
  /**
   * 是否进入首页的精选四张卡
   */
  featured: boolean;
  title: string;
}

/**
 * 站内统一的口径说明文案。
 * 首页的「三分钟读懂」与「关于」页的方法论章节共用，避免两处各写一份后走样。
 */
export const METHOD_NOTES: MethodNote[] = [
  {
    body: "站内金额统一折算成人民币，用的是构建时拉取的市场参考汇率，作为横向比较的共同基准。这不是经济学意义上的购买力平价（PPP），也不含住房等固定成本。唯一全程本币相除、不经过汇率的指标是「1 小时能买几个巨无霸」。",
    featured: true,
    title: "汇率折算不等于购买力平价",
  },
  {
    body: "工资一律取各国法定最低工资的税前名义值，不扣税、不计福利，也不反映各国社保与失业保障制度的差异。实际到手金额一定更低。",
    featured: true,
    title: "工资是税前法定值",
  },
  {
    body: "西班牙、比利时、智利、捷克等国按月或按周设定最低工资，本项目按来源明确写出的工时数折算成时薪；印度、墨西哥、泰国、菲律宾按日薪折算。这部分国家的时薪可比性弱于直接公布时薪的国家。",
    featured: true,
    title: "工时折算口径各不相同",
  },
  {
    body: "iPhone、巨无霸、物资篮、Model Y 的价格各有各的采集日期，与汇率更新日期并不一定相同；各地区标价是否含税也不同，展开行逐条可查。",
    featured: false,
    title: "商品价格是快照，不是实时价",
  },
  {
    body: "加拿大、美国、日本、中国、印度、墨西哥、泰国、菲律宾没有全国统一的单一最低时薪，本项目取地区中位数或集体协议口径，并在数据中标记为代理值。巨无霸指数中 9 个欧元区国家采用 Euro area 汇总行。",
    featured: false,
    title: "代理数据已逐条标注",
  },
  {
    body: `工资、巨无霸、Model Y 各覆盖 ${hourlyPower.length} 个国家/地区，iPhone 与物资篮各 25 个；五项数据齐备的有 ${commonCodes.length} 个。对比页可以只看齐备国家。`,
    featured: true,
    title: "各指数覆盖率不同",
  },
];

/**
 * 首屏与页脚的简短口径串
 */
export const SCOPE_CHIPS: string[] = [
  "税前法定最低工资",
  "市场汇率折算（非 PPP）",
  "商品价格为快照",
  `五指数齐备 ${commonCodes.length} 国`,
];
