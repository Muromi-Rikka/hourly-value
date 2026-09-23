import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const bigmacExploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/bigmac-explore"), "BigMacExplore"),
  getParentRoute: () => rootRoute,
  path: "/bigmac-explore",
});
