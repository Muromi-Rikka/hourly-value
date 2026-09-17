import * as React from "react";
import { cn } from "@/lib/utilities";

function Card({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...properties} />;
}
Card.displayName = "Card";

function CardHeader({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...properties} />;
}
CardHeader.displayName = "CardHeader";

function CardTitle({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("font-semibold leading-none tracking-tight", className)} {...properties} />;
}
CardTitle.displayName = "CardTitle";

function CardDescription({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-muted-foreground", className)} {...properties} />;
}
CardDescription.displayName = "CardDescription";

function CardContent({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...properties} />;
}
CardContent.displayName = "CardContent";

function CardFooter({ className, ...properties }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...properties} />;
}
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
