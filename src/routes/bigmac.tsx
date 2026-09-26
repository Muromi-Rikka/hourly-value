import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

export const bigmacRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/bigmac"), "BigMac"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/bigmac"),
  path: "/bigmac",
});
