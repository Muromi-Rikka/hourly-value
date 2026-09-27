import type * as React from "react";

import { CountryFlag } from "@/components/country-flag";
import { FadeContent } from "@/components/react-bits/FadeContent/FadeContent";
import { cn } from "@/lib/utilities";

interface RegionBar {
  /**
  * 区域名，同时作 React key
  */
  key: string;
  label: string;
  /**
  * 0..1 的条长比例，由调用方按各自口径算好
  */
  scale: number;
  /**
  * 柱内右侧数值（含单位与括号），由调用方格式化
  */
  value: React.ReactNode;
}

interface RegionBreakdownProperties {
  bars: RegionBar[];
  /**
  * 旗帜条上的计数文案，如 `27 个国家 · 6 个区域`
  */
  caption: React.ReactNode;
  flags: RegionFlagItem[];
  /**
  * 标题下的口径补充；不传则标题单独一行（mb-3）
  */
  subtitle?: React.ReactNode;
  title: React.ReactNode;
}

interface RegionFlagItem {
  countryCode: string;
  key: string;
  title: string;
}

/**
 * 四个指数落地页共用的右栏：区域条形 + 国旗条。
 * 结构与样式只此一份；用中位数还是均值、绝对值、百分号还是小时，由调用方算好传进来——
 * 这些正是四个页面的真实差异，用 props 表达而不是复制 JSX。
 */
export function RegionBreakdown({ bars, caption, flags, subtitle, title }: RegionBreakdownProperties) {
  return (
    <>
      <p className={cn("text-sm text-muted-foreground", subtitle === undefined ? "mb-3" : "mb-1")}>{title}</p>
      {subtitle === undefined ? null : <p className="mb-3 text-xs text-muted-foreground">{subtitle}</p>}
      <FadeContent duration={800} threshold={0.2}>
        <div className="space-y-2.5">
          {bars.map(bar => (
            <div className="flex items-center gap-3" key={bar.key}>
              <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">{bar.label}</span>
              <div className="relative h-5 flex-1 overflow-hidden rounded-sm bg-muted">
                <div
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-sm bg-primary transition-transform duration-300 ease-out"
                  style={{ transform: `scaleX(${bar.scale})` }}
                />
                <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold tabular-nums">
                  {bar.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </FadeContent>

      {/* Flag strip */}
      <div className="mt-5 border-t pt-4">
        <p className="mb-2 text-xs text-muted-foreground">{caption}</p>
        <div className="flex flex-wrap gap-1">
          {flags.map(flag => (
            <span
              className="flex h-7 w-7 items-center justify-center rounded-sm transition-transform hover:scale-110"
              key={flag.key}
              title={flag.title}
            >
              <CountryFlag className="h-5 w-5" countryCode={flag.countryCode} />
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
