import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

export const modelyRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/modely"), "ModelY"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/modely"),
  path: "/modely",
});
