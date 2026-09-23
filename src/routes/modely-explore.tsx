import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const modelyExploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/modely-explore"), "ModelYExplore"),
  getParentRoute: () => rootRoute,
  path: "/modely-explore",
});
