import { regionLegend } from "@/lib/region";

/**
 * 排行图底部的区域图例
*/
export function RegionLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-2">
      {regionLegend.map(item => (
        <div className="flex items-center gap-1.5" key={item.label}>
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: item.color }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
