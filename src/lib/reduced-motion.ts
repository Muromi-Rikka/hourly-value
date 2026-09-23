/**
 * 系统级「减少动态效果」（prefers-reduced-motion）开关。
 *
 * CSS 动画与过渡已由 `app.css` 的全局 media query 统一压到 0.01ms；
 * 本函数服务于 GSAP / motion 等 JS 驱动的动画——命中时跳过时间线，
 * 直接呈现终态。
 *
 * 本项目为纯 SPA（无 SSR），仅在客户端调用。
 */
export function shouldReduceMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
