import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const bigmacRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/bigmac"), "BigMac"),
  getParentRoute: () => rootRoute,
  path: "/bigmac",
});
