import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

export const iphoneRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/iphone"), "IPhone"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/iphone"),
  path: "/iphone",
});
