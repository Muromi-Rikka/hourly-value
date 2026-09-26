import { cn } from "@/lib/utilities";

interface CoverageBadgeProperties {
  className?: string;
  /**
   * 该国有数据的指标数，上限 5
   */
  coverage: number;
}

const TOTAL = 5;

/**
 * 覆盖率徽章：让"缺数据"在列表里可见，而不是混进排行冒充观测值。
 */
export function CoverageBadge({ className, coverage }: CoverageBadgeProperties) {
  const isComplete = coverage >= TOTAL;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap",
        isComplete
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground",
        className,
      )}
      title={isComplete
        ? `${TOTAL} 项数据齐备`
        : `${coverage}/${TOTAL} 项有数据，缺少的部分不参与该指标排行`}
    >
      {coverage}
      /
      {TOTAL}
    </span>
  );
}
