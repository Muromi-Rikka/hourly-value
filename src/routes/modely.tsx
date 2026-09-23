import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const modelyRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/modely"), "ModelY"),
  getParentRoute: () => rootRoute,
  path: "/modely",
});
