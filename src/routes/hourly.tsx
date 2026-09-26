import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

/**
 * `/hourly` 的 URL 状态：对比国家、当前排行指标、数据范围。
 * 全部进 query，刷新与复制链接都能还原同一屏内容。
 */
export interface HourlySearch {
  a?: string;
  b?: string;
  metric?: string;
  scope?: "all" | "common";
}

const hourlyRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/hourly"), "Hourly"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/hourly"),
  path: "/hourly",
  validateSearch: (search: Record<string, unknown>): HourlySearch => ({
    a: typeof search.a === "string" ? search.a : undefined,
    b: typeof search.b === "string" ? search.b : undefined,
    metric: typeof search.metric === "string" ? search.metric : undefined,
    scope: search.scope === "common" ? "common" : undefined,
  }),
});

export { hourlyRoute };
