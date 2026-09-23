import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const commodityExploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/commodity-explore"), "CommodityExplore"),
  getParentRoute: () => rootRoute,
  path: "/commodity-explore",
});
