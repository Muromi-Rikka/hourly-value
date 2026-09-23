import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const commodityRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/commodity"), "Commodity"),
  getParentRoute: () => rootRoute,
  path: "/commodity",
});
