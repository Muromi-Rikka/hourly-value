import type { BigMacEntry } from "@/data/bigmac";
import { CountryFlag } from "@/components/country-flag";
import { sortedByValuation } from "@/data/bigmac";

interface BigMacTooltipProperties {
  active?: boolean;
  payload?: Array<{ payload: BigMacEntry }>;
}

export function BigMacTooltip({ active, payload }: BigMacTooltipProperties) {
  if (!active || !payload?.length) {
    return null;
  }
  const entry = payload[0].payload;
  const rank = sortedByValuation.findIndex(w => w.countryCode === entry.countryCode) + 1;

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
          {sortedByValuation.length}
        </span>
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="text-sm text-muted-foreground">
          当地价格：
          {entry.localPriceFormatted}
        </p>
        <p className="text-sm font-medium text-primary">
          ≈ $
          {entry.usdPrice.toFixed(2)}
          {" USD"}
        </p>
        <p className="text-sm tabular-nums" style={{ color: entry.valuationPct > 0 ? "var(--color-positive, #16a34a)" : (entry.valuationPct < 0 ? "var(--color-negative, #dc2626)" : "var(--color-muted-foreground)") }}>
          {entry.valuationPct > 0 ? "高估 " : (entry.valuationPct < 0 ? "低估 " : "")}
          {entry.valuationPct > 0 ? "+" : ""}
          {entry.valuationPct}
          %
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
          {entry.dataDate}
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
