import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Info } from "lucide-react";

import { CountryFlag } from "@/components/country-flag";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { BlurText } from "@/components/react-bits/BlurText/BlurText";
import { FadeContent } from "@/components/react-bits/FadeContent/FadeContent";
import { Separator } from "@/components/ui/separator";
import { BIGMAC_SOURCE } from "@/data/bigmac";
import { COMMODITY_SOURCE } from "@/data/commodity";
import { ratesProvider, ratesUpdatedAt } from "@/data/exchange-rates";
import { commonCodes } from "@/data/hourly-power";
import { IPHONE_SOURCE, iphones } from "@/data/iphone";
import { METHOD_NOTES } from "@/data/methodology";
import { MODELY_SOURCE, modelys } from "@/data/modely";
import { wages } from "@/data/wages";

// 汇率来源链接跟随实际生效的 provider（主源 Frankfurter / 备用源 open.er-api.com）
const RATES_PROVIDER_HREF = ratesProvider.includes("Frankfurter")
  ? "https://frankfurter.app"
  : "https://open.er-api.com";

const ABOUT_INDEXES = [
  {
    desc: `把工资与四项消费指标放在同一张表里对比，可选两个国家逐项比较，并只看五项数据齐备的 ${commonCodes.length} 个国家。`,
    link: "/hourly",
    title: "一小时购买力",
  },
  {
    desc: `以各国货币对人民币的即期汇率折算法定时薪，横向对比 ${wages.length} 个国家/地区的最低时薪水平。`,
    link: "/explore",
    title: "最低工资",
  },
  {
    desc: "以各国最低时薪计算购买一部 iPhone 18 Pro（256GB）所需的工作小时数，另提供 iPhone Duo 机型对照。",
    link: "/iphone",
    title: "iPhone 指数",
  },
  {
    desc: "以各国最低时薪计算购买固定生活物资篮子（米、面、油、肉、蛋、奶等）所需的工作小时数。",
    link: "/commodity",
    title: "物资篮子指数",
  },
  {
    desc: "对比各国巨无霸汉堡的美元售价，衡量货币相对美元的高估与低估，并给出一小时最低工资可购买的巨无霸数量。",
    link: "/bigmac",
    title: "巨无霸指数",
  },
  {
    desc: "以各国最低时薪计算购买一辆 Tesla Model Y 后驱版所需的工作天数。",
    link: "/modely",
    title: "Model Y 指数",
  },
];

const IPHONE_SOURCE_NOTE = `${IPHONE_SOURCE.note}。iPhone Duo 与 iPhone 18 Pro 使用同一组官方商城链接，逐条含税口径差异见「探索」页展开行。`;
const MODELY_SOURCE_NOTE = `${MODELY_SOURCE.note}。美国不含州销售税、欧洲含 VAT、亚太含 GST/消费税。`;

interface SourceItem {
  countryCode: string;
  name: string;
  source: string;
  sourceUrl: string;
}

export function About() {
  return (
    <div>
      {/* Header */}
      <div className="pb-8">
        <div className="rule-top mb-6" />
        <BlurText
          animateBy="words"
          className="text-balance font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.1] tracking-[-0.02em]"
          delay={150}
          text="关于本项目"
        />
        <AnimatedContent delay={0.1} distance={20} duration={0.5}>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-pretty text-muted-foreground">
            数据来源、折算方法与使用说明
          </p>
        </AnimatedContent>
      </div>

      {/* Methodology */}
      <AnimatedContent distance={30} duration={0.6}>
        <section className="max-w-prose space-y-3 pb-10 text-sm leading-relaxed text-pretty text-muted-foreground">
          <p>
            所有数据均以各国家/地区政府官方公布的法定最低时薪为基准。
            对于按月设定最低工资的国家（如西班牙、比利时、智利），按法定工时数折算为时薪。
          </p>
          <p>
            人民币折算使用构建时自动拉取的最新市场参考汇率（详见下方「汇率来源与更新」），
            旨在提供一个直观的购买力参考，而非精确的购买力平价（PPP）计算。
          </p>
          <p>
            各国数据生效日期不同，部分为 2025 年已执行标准，部分为 2026 年已公告标准。
            所有数据均可通过下方来源清单追溯至官方文件。
          </p>
          <p>
            其余指数中的商品价格（iPhone、生活物资篮子、巨无霸汉堡、Tesla Model Y）
            来自公开的全球价格数据，逐条出处见下方各指数数据来源，
            也可在各指数「探索」页的展开行中查看。
          </p>
          <p>
            想直接看「同样工作一小时能买到什么」，请前往
            <Link className="mx-1 text-primary underline underline-offset-2" to="/hourly">一小时购买力</Link>
            对比页。
          </p>
        </section>
      </AnimatedContent>

      {/* Method notes — 与首页口径卡共用同一份文案 */}
      <AnimatedContent delay={0.05} distance={30} duration={0.6}>
        <section className="border-t pt-8 pb-10">
          <h2 className="mb-5 font-display text-xl font-normal tracking-tight">这些数字该怎么读</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {METHOD_NOTES.map(note => (
              <div className="rounded-xl bg-muted/50 p-4" key={note.title}>
                <p className="text-sm font-medium">{note.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{note.body}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedContent>

      {/* Exchange rates */}
      <AnimatedContent delay={0.05} distance={25} duration={0.6}>
        <section className="border-t pt-8 pb-10">
          <h2 className="mb-5 font-display text-xl font-normal tracking-tight">汇率来源与更新</h2>
          <div className="max-w-prose space-y-2 rounded-xl bg-muted/50 p-5 text-xs leading-relaxed text-pretty text-muted-foreground">
            <p>
              人民币折算所用汇率于每次构建与开发启动时自动拉取，当前生效汇率更新于
              {" "}
              <span className="font-medium text-foreground">{ratesUpdatedAt}</span>
              ，来源
              {" "}
              <a
                className="text-primary underline decoration-primary/50 underline-offset-2 hover:text-primary/80"
                href={RATES_PROVIDER_HREF}
                rel="noopener noreferrer"
                target="_blank"
              >
                {ratesProvider}
              </a>
              。
            </p>
            <p>
              主源为 Frankfurter（欧洲央行每个工作日 16:00 CET 更新参考汇率，周末与节假日沿用上一工作日数据）；
              ECB 参考汇率不含智利比索（CLP），缺失币种或主源失败时回退备用源 open.er-api.com；
              两源皆失败则沿用上次成功获取的汇率，构建不会中断。
            </p>
            <p>
              巨无霸指数例外：其美元价与估值偏差沿用来源数据集发布时的快照值，不随实时汇率变动。
            </p>
          </div>
        </section>
      </AnimatedContent>

      {/* Five indices */}
      <AnimatedContent delay={0.05} distance={25} duration={0.6}>
        <section className="border-t pt-8 pb-2">
          <h2 className="mb-5 font-display text-xl font-normal tracking-tight">数据入口</h2>
          <ul className="space-y-4">
            {ABOUT_INDEXES.map(item => (
              <li key={item.link}>
                <Link className="group flex items-start justify-between gap-4" to={item.link}>
                  <div className="min-w-0">
                    <p className="text-base font-medium transition-colors group-hover:text-primary">{item.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
                <Separator className="mt-4" />
              </li>
            ))}
          </ul>
        </section>
      </AnimatedContent>

      {/* Sources — wages */}
      <AnimatedContent delay={0.1} distance={20} duration={0.5}>
        <section className="border-t pt-8">
          <h2 className="mb-5 font-display text-xl font-normal tracking-tight">最低工资数据来源</h2>
          <ul className="space-y-4">
            {wages.map((entry, index) => (
              <SourceRow
                index={index}
                item={{
                  countryCode: entry.countryCode,
                  name: entry.country,
                  source: entry.source,
                  sourceUrl: entry.sourceUrl,
                }}
                key={entry.countryCode}
              />
            ))}
          </ul>
        </section>
      </AnimatedContent>

      {/* Sources — iPhone */}
      <AnimatedContent delay={0.1} distance={20} duration={0.5}>
        <section className="border-t pt-8">
          <h2 className="mb-5 font-display text-xl font-normal tracking-tight">iPhone 指数数据来源</h2>
          <p className="mb-5 max-w-prose text-xs leading-relaxed text-pretty text-muted-foreground">
            {IPHONE_SOURCE_NOTE}
          </p>
          <ul className="space-y-4">
            {iphones.map((entry, index) => (
              <SourceRow
                index={index}
                item={{
                  countryCode: entry.countryCode,
                  name: entry.country,
                  source: entry.source,
                  sourceUrl: entry.sourceUrl,
                }}
                key={entry.countryCode}
              />
            ))}
          </ul>
        </section>
      </AnimatedContent>

      {/* Sources — commodity */}
      <AnimatedContent delay={0.1} distance={20} duration={0.5}>
        <section className="border-t pt-8">
          <h2 className="mb-5 font-display text-xl font-normal tracking-tight">物资篮子指数数据来源</h2>
          <SourceCard
            date={COMMODITY_SOURCE.date}
            name={COMMODITY_SOURCE.name}
            note={`${COMMODITY_SOURCE.note}。篮子构成：5kg面粉 · 5kg大米 · 1kg食糖 · 1kg食盐 · 2L牛奶 · 24个鸡蛋 · 5L食用油 · 1kg牛肉 · 1kg鸡肉。`}
            url={COMMODITY_SOURCE.url}
          />
        </section>
      </AnimatedContent>

      {/* Sources — Big Mac */}
      <AnimatedContent delay={0.1} distance={20} duration={0.5}>
        <section className="border-t pt-8">
          <h2 className="mb-5 font-display text-xl font-normal tracking-tight">巨无霸指数数据来源</h2>
          <SourceCard
            name={BIGMAC_SOURCE.name}
            note={`${BIGMAC_SOURCE.note}。估值以美国基准价 $6.22 为锚。`}
            url={BIGMAC_SOURCE.url}
          />
        </section>
      </AnimatedContent>

      {/* Sources — Model Y */}
      <AnimatedContent delay={0.1} distance={20} duration={0.5}>
        <section className="border-t pt-8">
          <h2 className="mb-5 font-display text-xl font-normal tracking-tight">Model Y 指数数据来源</h2>
          <p className="mb-5 max-w-prose text-xs leading-relaxed text-pretty text-muted-foreground">
            {MODELY_SOURCE_NOTE}
          </p>
          <ul className="space-y-4">
            {modelys.map((entry, index) => (
              <SourceRow
                index={index}
                item={{
                  countryCode: entry.countryCode,
                  name: entry.country,
                  source: entry.source,
                  sourceUrl: entry.sourceUrl,
                }}
                key={entry.countryCode}
              />
            ))}
          </ul>
        </section>
      </AnimatedContent>

      {/* Disclaimer */}
      <FadeContent duration={800}>
        <section className="mt-12 max-w-prose border-t pt-6 pb-4">
          <div className="rounded-xl bg-muted/50 p-5 flex gap-3">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              本项目仅用于信息展示和学习目的，不构成任何法律、劳动或投资建议。
              各国最低工资标准可能因地区、行业、年龄等因素存在差异。
              请以各国政府官方发布为准。站内金额按市场汇率折算，不等于购买力平价，
              也不构成对任何货币真实价值的判断。
            </p>
          </div>
        </section>
      </FadeContent>
    </div>
  );
}

/**
 * 单一来源卡片：适用于整个指数共用一个来源的场景
 */
function SourceCard({ date, name, note, url }: {
  date?: string;
  name: string;
  note: string;
  url: string;
}) {
  return (
    <div className="rounded-xl bg-muted/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-medium">{name}</p>
        <a
          className="inline-flex shrink-0 items-center gap-1 text-xs text-primary hover:underline decoration-primary/50 underline-offset-2 hover:text-primary/80"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          访问来源
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      {date && (
        <p className="mt-1 text-xs text-muted-foreground">
          数据时间：
          {date}
        </p>
      )}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

/**
 * 逐国来源行：序号 + 国旗 + 国家 + 来源机构 + 外链
 */
function SourceRow({ index, item }: { index: number; item: SourceItem }) {
  return (
    <li>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <div>
            <p className="flex items-center gap-2 text-base font-medium">
              <CountryFlag className="h-5 w-5" countryCode={item.countryCode} />
              {item.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.source}</p>
          </div>
        </div>
        <a
          className="inline-flex shrink-0 items-center gap-1 text-xs text-primary hover:underline decoration-primary/50 underline-offset-2 hover:text-primary/80"
          href={item.sourceUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          访问来源
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <Separator className="mt-4" />
    </li>
  );
}
