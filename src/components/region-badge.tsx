import { regionColor } from "@/lib/region";

interface RegionBadgeProperties {
  region: string;
}

interface RegionDotProperties {
  region: string;
}

/**
 * 区域徽章：底色即数据色，明暗主题下分别配白字/墨字保证对比度
*/
export function RegionBadge({ region }: RegionBadgeProperties) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{
        background: regionColor(region),
        color: "var(--color-background)",
      }}
    >
      {region}
    </span>
  );
}

/**
 * tooltip / 图例中的小圆点
*/
export function RegionDot({ region }: RegionDotProperties) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full"
      style={{ background: regionColor(region) }}
    />
  );
}
