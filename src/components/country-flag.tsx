import { Icon } from "@iconify/react";

import { cn } from "@/lib/utilities";

interface CountryFlagProperties {
  className?: string;
  countryCode: string;
}

export function CountryFlag({ className, countryCode }: CountryFlagProperties) {
  return (
    <Icon
      className={cn("inline-block shrink-0", className)}
      icon={`circle-flags:${countryCode.toLowerCase()}`}
    />
  );
}
