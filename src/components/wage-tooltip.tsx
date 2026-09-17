import type { WageEntry } from "@/data/wages";
import { CountryFlag } from "@/components/country-flag";
import { sortedByWage } from "@/data/wages";

interface WageTooltipProperties {
  active?: boolean;
  payload?: Array<{ payload: WageEntry }>;
}

export function WageTooltip({ active, payload }: WageTooltipProperties) {
  if (!active || !payload?.length) {
    return null;
  }
  const entry = payload[0].payload;
  const rank = sortedByWage.findIndex(w => w.countryCode === entry.countryCode) + 1;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <div className="flex items-center gap-2">
        <CountryFlag className="h-4 w-4" countryCode={entry.countryCode} />
        <span className="font-semibold text-foreground">{entry.country}</span>
        <span
          className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white"
          style={{ background: regionBg(entry.region) }}
        >
          #
          {rank}
          /
          {sortedByWage.length}
        </span>
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="text-sm text-muted-foreground">
          {entry.localWage.toLocaleString()}
          {" "}
          {entry.localUnit}
        </p>
        <p className="text-sm font-medium text-primary">
          ≈ ¥
          {entry.cnyEquivalent}
          /小时
        </p>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: regionBg(entry.region) }}
        />
        <span className="text-[11px] text-muted-foreground">{entry.region}</span>
        <span className="text-[11px] text-muted-foreground">
          ·
          {" "}
          {entry.effectiveDate}
          {" "}
          生效
        </span>
      </div>
    </div>
  );
}

function regionBg(region: string): string {
  if (region === "北美") {
    return "var(--color-region-north-america)";
  }
  if (region === "亚洲") {
    return "var(--color-region-asia)";
  }
  if (region === "欧洲") {
    return "var(--color-region-europe)";
  }
  return "var(--color-region-oceania)";
}
