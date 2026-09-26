import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

export const bigmacExploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/bigmac-explore"), "BigMacExplore"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/bigmac-explore"),
  path: "/bigmac-explore",
});
