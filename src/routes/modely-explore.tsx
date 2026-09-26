import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

export const modelyExploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/modely-explore"), "ModelYExplore"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/modely-explore"),
  path: "/modely-explore",
});
