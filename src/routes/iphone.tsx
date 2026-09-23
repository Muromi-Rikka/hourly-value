import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "@/routes/__root";

export const iphoneRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/iphone"), "IPhone"),
  getParentRoute: () => rootRoute,
  path: "/iphone",
});
