import { ExternalLink } from "lucide-react";

import { CountryFlag } from "@/components/country-flag";
import { Separator } from "@/components/ui/separator";
import { wages } from "@/data/wages";

export function About() {
  return (
    <div>
      {/* Header */}
      <div className="pb-8">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-normal leading-[1.1] tracking-[-0.02em]">
          关于本项目
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
          数据来源、折算方法与使用说明
        </p>
      </div>

      {/* Methodology */}
      <section className="max-w-prose space-y-3 pb-10 text-sm leading-relaxed text-muted-foreground">
        <p>
          所有数据均以各国家/地区政府官方公布的法定最低时薪为基准。
          对于按月设定最低工资的国家（如西班牙、中国），按法定月工作小时数折算为时薪。
        </p>
        <p>
          人民币折算使用各国货币对人民币的即期汇率（查询时间点约为 2025 年中），
          旨在提供一个直观的购买力参考，而非精确的购买力平价（PPP）计算。
        </p>
        <p>
          各国数据生效日期不同，部分为 2025 年已执行标准，部分为 2026 年已公告标准。
          所有数据均可通过下方来源链接追溯至官方文件。
        </p>
      </section>

      {/* Sources */}
      <section className="border-t pt-8">
        <h2 className="mb-5 font-display text-xl font-normal tracking-tight">数据来源</h2>
        <ul className="space-y-4">
          {wages.map(entry => (
            <li key={entry.countryCode}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-base font-medium">
                    <CountryFlag className="h-5 w-5" countryCode={entry.countryCode} />
                    {entry.country}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{entry.source}</p>
                </div>
                <a
                  className="inline-flex shrink-0 items-center gap-1 text-xs text-primary underline underline-offset-2 hover:text-primary/80"
                  href={entry.sourceUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  访问来源
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <Separator className="mt-4" />
            </li>
          ))}
        </ul>
      </section>

      {/* Disclaimer */}
      <section className="mt-12 max-w-prose border-t pt-6 pb-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          本项目仅用于信息展示和学习目的，不构成任何法律、劳动或投资建议。
          各国最低工资标准可能因地区、行业、年龄等因素存在差异。
          请以各国政府官方发布为准。
        </p>
      </section>
    </div>
  );
}
