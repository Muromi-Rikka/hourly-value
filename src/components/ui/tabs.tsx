import type * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cn } from "@/lib/utilities";

interface TabsContentProperties extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

interface TabsProperties extends Omit<React.HTMLAttributes<HTMLDivElement>, "onValueChange"> {
  /**
   * 非受控模式的初始值；与 `value` 同时省略时无选中项
   */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}

interface TabsTriggerProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

/**
 * shadcn 风格的 Tabs 外壳，内部由 Base UI 提供 role/aria/方向键等可访问性行为。
 * 导出名与 props 契约保持不变，调用方无需感知底层原语。
 */
function Tabs({ children, className, defaultValue, onValueChange, value, ...properties }: TabsProperties) {
  return (
    <BaseTabs.Root
      className={cn(className)}
      defaultValue={defaultValue ?? null}
      onValueChange={v => onValueChange?.(String(v))}
      value={value}
      {...properties}
    >
      {children}
    </BaseTabs.Root>
  );
}

function TabsList({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <BaseTabs.List
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...properties}
    />
  );
}

function TabsTrigger({ className, value, ...properties }: TabsTriggerProperties) {
  return (
    <BaseTabs.Tab
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        "data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-card",
        className,
      )}
      value={value}
      {...properties}
    />
  );
}
TabsList.displayName = "TabsList";
TabsTrigger.displayName = "TabsTrigger";

function TabsContent({ className, value, ...properties }: TabsContentProperties) {
  return (
    <BaseTabs.Panel
      className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}
      value={value}
      {...properties}
    />
  );
}
TabsContent.displayName = "TabsContent";

export { Tabs, TabsContent, TabsList, TabsTrigger };
