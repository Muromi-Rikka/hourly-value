import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

export const iphoneExploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/iphone-explore"), "IPhoneExplore"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/iphone-explore"),
  path: "/iphone-explore",
});
