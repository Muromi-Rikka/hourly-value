import { ChevronDown } from "lucide-react";

import type { HourlyPowerEntry } from "@/data/hourly-power";

import { CountryFlag } from "@/components/country-flag";
import { cn } from "@/lib/utilities";

interface CountrySelectProperties {
  className?: string;
  id: string;
  label: string;
  onChange: (countryCode: string) => void;
  options: HourlyPowerEntry[];
  value: string;
}

/**
 * 国家选择器。
 *
 * 刻意用原生 `<select>`：移动端直接调起系统选择器、键盘与读屏行为免费，
 * 而自绘下拉需要额外的 popover/command 组件与焦点管理。当前场景不值得。
 */
export function CountrySelect({ className, id, label, onChange, options, value }: CountrySelectProperties) {
  const current = options.find(option => option.countryCode === value);

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <label className="text-xs text-muted-foreground" htmlFor={id}>{label}</label>
      <div className="flex items-center gap-2">
        {current
          ? <CountryFlag className="h-5 w-5 shrink-0" countryCode={current.countryCode} />
          : null}
        <div className="relative min-w-0 flex-1">
          <select
            className="w-full appearance-none truncate rounded-md border border-border bg-card py-2 pr-8 pl-3 text-sm font-medium transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            id={id}
            onChange={event => onChange(event.target.value)}
            value={value}
          >
            {options.map(option => (
              <option key={option.countryCode} value={option.countryCode}>
                {option.country}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}
