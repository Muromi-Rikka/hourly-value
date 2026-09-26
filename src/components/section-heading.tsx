import * as React from "react";

import { cn } from "@/lib/utilities";

interface SectionHeadingProperties {
  /**
   * 右侧操作区（按钮/链接），省略则不渲染
   */
  action?: React.ReactNode;
  /**
   * 标题层级，默认 h2
   */
  as?: "h2" | "h3";
  className?: string;
  /**
   * 标题下的说明文字
   */
  description?: React.ReactNode;
  /**
   * 眉题（小标签）
   */
  eyebrow?: React.ReactNode;
  /**
   * 主标题
   */
  title: React.ReactNode;
}

/**
 * 统一的区块标题：眉题 + 标题 + 说明 + 右侧操作。
 * 全站「一个区块一个标题」的唯一写法，保证尺度与间距一致。
 */
export function SectionHeading({
  action,
  as: Tag = "h2",
  className,
  description,
  eyebrow,
  title,
}: SectionHeadingProperties) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="min-w-0 space-y-1.5">
        {eyebrow
          ? (
              <p className="eyebrow">{eyebrow}</p>
            )
          : null}
        <Tag className="section-title text-balance">{title}</Tag>
        {description
          ? (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {description}
              </p>
            )
          : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}
