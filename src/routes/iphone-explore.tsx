import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const iphoneExploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/iphone-explore"), "IPhoneExplore"),
  getParentRoute: () => rootRoute,
  path: "/iphone-explore",
});
