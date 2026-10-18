import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import type { WageCaliber } from "@/data/wages";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

/**
 * `/explore`（最低工资页）的 URL 状态：工资换算口径。
 */
export interface ExploreSearch {
  caliber?: WageCaliber;
}

const exploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/explore"), "Explore"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/explore"),
  path: "/explore",
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    caliber: search.caliber === "monthly" ? "monthly" : undefined,
  }),
});

export { exploreRoute };
