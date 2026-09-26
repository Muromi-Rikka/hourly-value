import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

export const commodityRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/commodity"), "Commodity"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/commodity"),
  path: "/commodity",
});
