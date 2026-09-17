import * as React from "react";
import { cn } from "@/lib/utilities";

interface SelectContextValue {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onValueChange: (value: string) => void;
  value: string;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

interface SelectContentProperties extends React.HTMLAttributes<HTMLDivElement> {}

interface SelectItemProperties extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

interface SelectProperties {
  children: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}

interface SelectTriggerProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function Select({ children, defaultValue, onValueChange, value: controlledValue }: SelectProperties) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [isOpen, setIsOpen] = React.useState(false);
  const value = controlledValue ?? internalValue;
  const handleValueChange = React.useCallback(
    (v: string) => {
      setInternalValue(v);
      onValueChange?.(v);
      setIsOpen(false);
    },
    [onValueChange],
  );

  return (
    <SelectContext value={{ isOpen, onOpenChange: setIsOpen, onValueChange: handleValueChange, value }}>
      <div className="relative">{children}</div>
    </SelectContext>
  );
}

function SelectTrigger({ children, className, ...properties }: SelectTriggerProperties) {
  const { isOpen, onOpenChange } = useSelect();
  return (
    <button
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className,
      )}
      onClick={() => onOpenChange(!isOpen)}
      {...properties}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </button>
  );
}

function useSelect() {
  const context = React.use(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within <Select>");
  }
  return context;
}
SelectTrigger.displayName = "SelectTrigger";

function SelectValue({ className, placeholder, ...properties }: React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }) {
  const { value } = useSelect();
  return (
    <span className={cn("", className)} {...properties}>
      {value || placeholder}
    </span>
  );
}
SelectValue.displayName = "SelectValue";

function SelectContent({ children, className, ...properties }: SelectContentProperties) {
  const { isOpen } = useSelect();
  if (!isOpen) {
    return null;
  }
  return (
    <div className={cn("absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95", className)} {...properties}>
      {children}
    </div>
  );
}
SelectContent.displayName = "SelectContent";

function SelectItem({ children, className, value, ...properties }: SelectItemProperties) {
  const { onValueChange, value: selected } = useSelect();
  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        selected === value && "bg-accent",
        className,
      )}
      onClick={() => onValueChange(value)}
      {...properties}
    >
      {children}
    </div>
  );
}
SelectItem.displayName = "SelectItem";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
