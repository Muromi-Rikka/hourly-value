import * as React from "react";
import type { WageEntry } from "@/data/wages";

interface WageTooltipProperties {
  active?: boolean;
  payload?: Array<{ payload: WageEntry }>;
}

export function WageTooltip({ active, payload }: WageTooltipProperties) {
  if (!active || !payload?.length)
    return null;
  const entry = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="font-semibold text-foreground">{entry.country}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {entry.localWage.toLocaleString()}
        {" "}
        {entry.localUnit}
      </p>
      <p className="text-sm font-medium text-primary">
        ≈ ¥
        {entry.cnyEquivalent}
        /小时
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {entry.effectiveDate}
        {" "}
        生效
      </p>
    </div>
  );
}
