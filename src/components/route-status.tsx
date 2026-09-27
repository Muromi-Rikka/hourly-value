import type { ErrorComponentProps } from "@tanstack/react-router";

import { Link } from "@tanstack/react-router";

import { Button, buttonVariants } from "@/components/ui/button";

/**
 * 路由级错误兜底：懒加载分片失败或渲染抛错时给出可恢复入口，避免整站白屏。
 * 挂在 createRouter 上（defaultErrorComponent），布局与导航保持可用。
 */
export function RouteError({ reset }: ErrorComponentProps) {
  return (
    <section className="section">
      <p className="eyebrow">出错了</p>
      <h2 className="section-title mt-2">页面加载失败</h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
        可能是网络中断，或站点刚发布过新版本。重试一次通常就好。
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={reset} size="sm">重试</Button>
        <Link className={buttonVariants({ size: "sm", variant: "outline" })} to="/">回到首页</Link>
      </div>
    </section>
  );
}

/**
 * 路由切换中的占位：懒加载组件分片时给出可读状态（读屏经 role="status" 播报）。
 */
export function RoutePending() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status">
      <span className="text-sm text-muted-foreground">正在加载…</span>
    </div>
  );
}
