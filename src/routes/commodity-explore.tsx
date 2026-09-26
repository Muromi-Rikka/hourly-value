import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

export const commodityExploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/commodity-explore"), "CommodityExplore"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/commodity-explore"),
  path: "/commodity-explore",
});
