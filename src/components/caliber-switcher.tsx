import type { WageCaliber } from "@/data/wages";

import { Button } from "@/components/ui/button";
import { CALIBER_LABEL } from "@/data/wages";
import { cn } from "@/lib/utilities";

const CALIBERS: WageCaliber[] = ["hourly", "monthly"];

interface CaliberSwitcherProperties {
  onChange: (caliber: WageCaliber) => void;
  value: WageCaliber;
}

/**
 * 工资换算口径切换器：官方时薪口径 / 月薪折算口径。
 * 切换会整页重新取数（含巨无霸、物资篮、iPhone、Model Y 所需工时），
 * 因为所有指标都以「1 小时最低工资」为分母。
 */
export function CaliberSwitcher({ onChange, value }: CaliberSwitcherProperties) {
  return (
    <div aria-label="工资换算口径" className="inline-flex flex-wrap items-center gap-1.5" role="group">
      <span className="mr-1 text-xs text-muted-foreground">工资口径</span>
      {CALIBERS.map(caliber => (
        <Button
          aria-pressed={caliber === value}
          className={cn(caliber === value && "border-primary text-primary")}
          key={caliber}
          onClick={() => onChange(caliber)}
          size="sm"
          variant="outline"
        >
          {CALIBER_LABEL[caliber]}
        </Button>
      ))}
    </div>
  );
}
