import * as React from "react";
import { cn } from "@/lib/utilities";

function Table({ className, ...properties }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...properties} />
    </div>
  );
}
Table.displayName = "Table";

function TableHeader({ className, ...properties }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b", className)} {...properties} />;
}
TableHeader.displayName = "TableHeader";

function TableBody({ className, ...properties }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...properties} />;
}
TableBody.displayName = "TableBody";

function TableFooter({ className, ...properties }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...properties} />;
}
TableFooter.displayName = "TableFooter";

function TableRow({ className, ...properties }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...properties} />;
}
TableRow.displayName = "TableRow";

function TableHead({ className, ...properties }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("eyebrow h-10 px-2 text-left align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)} {...properties} />;
}
TableHead.displayName = "TableHead";

function TableCell({ className, ...properties }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className)} {...properties} />;
}
TableCell.displayName = "TableCell";

function TableCaption({ className, ...properties }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn("mt-4 text-sm text-muted-foreground", className)} {...properties} />;
}
TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
