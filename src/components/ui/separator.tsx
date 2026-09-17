import * as React from "react";
import { cn } from "@/lib/utilities";

interface SeparatorProperties extends React.HTMLAttributes<HTMLDivElement> {
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
}

function Separator({ className, decorative = true, orientation = "horizontal", ...properties }: SeparatorProperties) {
  return (
    <div
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      role={decorative ? "none" : "separator"}
      {...properties}
    />
  );
}
Separator.displayName = "Separator";

export { Separator };
