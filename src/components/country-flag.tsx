import type { IconifyIcon, IconifyJSON } from "@iconify/react";

import { Icon } from "@iconify/react";

import circleFlagsData from "@/data/circle-flags.json";
import { cn } from "@/lib/utilities";

/**
 * 本地国旗数据（由 `pnpm flags` 生成，见 scripts/build-flags.mjs）。
 * 必须用本地数据：@iconify/react 遇到字符串 icon 会运行时去 api.iconify.design 拉，
 * 首屏旗帜晚到，离线/内网直接空白。
 */
const circleFlags = circleFlagsData as IconifyJSON;

interface CountryFlagProperties {
  className?: string;
  countryCode: string;
}

export function CountryFlag({ className, countryCode }: CountryFlagProperties) {
  // 显式注解成可空：仓库没开 noUncheckedIndexedAccess，索引结果类型是 IconifyIcon，
  // 不标注就写 `=== undefined` 会被 no-unnecessary-condition 判成多余判断。
  const icon: IconifyIcon | undefined = circleFlags.icons[countryCode.toLowerCase()];
  if (icon === undefined) {
    return null;
  }
  return (
    <Icon
      className={cn("inline-block shrink-0", className)}
      icon={{ body: icon.body, height: circleFlags.height, width: circleFlags.width }}
    />
  );
}
