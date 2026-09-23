import * as React from "react";
import { cn } from "@/lib/utilities";

interface TabsContextValue {
  onValueChange: (value: string) => void;
  value: string;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

interface TabsContentProperties extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

interface TabsProperties extends React.HTMLAttributes<HTMLDivElement> {
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

function Tabs({ children, className, defaultValue, onValueChange, value: controlledValue, ...properties }: TabsProperties) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = controlledValue ?? internalValue;
  const handleValueChange = React.useCallback(
    (v: string) => {
      setInternalValue(v);
      onValueChange?.(v);
    },
    [onValueChange],
  );

  return (
    <TabsContext value={{ onValueChange: handleValueChange, value }}>
      <div className={cn("", className)} {...properties}>{children}</div>
    </TabsContext>
  );
}

function TabsList({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)} {...properties} />;
}

function useTabs() {
  const context = React.use(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within <Tabs>");
  }
  return context;
}
TabsList.displayName = "TabsList";

function TabsTrigger({ className, value, ...properties }: TabsTriggerProperties) {
  const { onValueChange, value: selected } = useTabs();
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        selected === value && "bg-background text-foreground shadow",
        className,
      )}
      onClick={() => onValueChange(value)}
      {...properties}
    />
  );
}
TabsTrigger.displayName = "TabsTrigger";

function TabsContent({ className, value, ...properties }: TabsContentProperties) {
  const { value: selected } = useTabs();
  if (selected !== value) {
    return null;
  }
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)} {...properties} />;
}
TabsContent.displayName = "TabsContent";

export { Tabs, TabsContent, TabsList, TabsTrigger };
