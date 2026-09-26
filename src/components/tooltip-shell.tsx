import type * as React from "react";

import { CountryFlag } from "@/components/country-flag";
import { RegionDot } from "@/components/region-badge";
import { regionColor } from "@/lib/region";

interface TooltipShellProperties {
  /**
  * 主指标区（价格、工时等），1-3 行
  */
  children: React.ReactNode;
  country: string;
  countryCode: string;
  /**
  * 附注区（税费说明、生效日期等）
  */
  note?: React.ReactNode;
  /**
  * 排名与总数；不传则不显示排名角标
  */
  rank?: number;
  region: string;
  total?: number;
}

/**
 * 指数 tooltip 的统一外壳：国旗+国家名+排名角标 → 主指标 → 区域+附注。
 * 各指数只负责填内容，不重复排版。
 */
export function TooltipShell({ children, country, countryCode, note, rank, region, total }: TooltipShellProperties) {
  return (
    <div className="rounded-lg border bg-background/95 p-3 shadow-float backdrop-blur-md">
      <div className="flex items-center gap-2">
        <CountryFlag className="h-4 w-4" countryCode={countryCode} />
        <span className="font-semibold text-foreground">{country}</span>
        {rank !== undefined && total !== undefined && (
          <span
            className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none"
            style={{
              background: regionColor(region),
              color: "var(--color-background)",
            }}
          >
            #
            {rank}
            /
            {total}
          </span>
        )}
      </div>

      <div className="mt-2 space-y-0.5">{children}</div>

      <div className="mt-1.5 flex items-center gap-2">
        <RegionDot region={region} />
        <span className="text-[11px] text-muted-foreground">{region}</span>
        {note && (
          <span className="text-[11px] text-muted-foreground">
            ·
            {" "}
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
