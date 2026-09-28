import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utilities";

/**
 * 卡片的四个填充档位 —— 全站"卡片长什么样"只在这里定义一次。
 *
 * default  普通卡片：纸面 + 柔和描边 + 轻投影（指数卡、口径卡）
 * raised   抬升面板：投影深一档，用于页面主件（一小时钱包、A/B 对比）
 * tinted   淡青底：需要被注意但不该压过内容的块（来源卡、选中态区域卡）
 * inverse  墨底反白：整段反相，是全站唯一的"重色块"，只给数据亮点带用
 *
 * 描边统一显式写 `border-border`：Tailwind v4 的 preflight 把 `border`
 * 的颜色留在 currentColor，不写就会变成近黑硬描边（盒子感的来源）。
 */
const cardVariants = cva("rounded-xl border", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "border-border bg-card text-card-foreground shadow-card",
      inverse: "border-foreground bg-foreground text-background shadow-panel",
      raised: "border-border bg-card text-card-foreground shadow-panel",
      tinted: "border-primary/20 bg-primary/6 text-card-foreground shadow-card",
    },
  },
});

export interface CardProperties
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...properties }: CardProperties) {
  return <div className={cn(cardVariants({ variant }), className)} {...properties} />;
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

// eslint-disable-next-line react-refresh/only-export-components -- shadcn pattern: variants alongside component
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
