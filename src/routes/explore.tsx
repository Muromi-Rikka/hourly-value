import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";

const exploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/explore"), "Explore"),
  getParentRoute: () => rootRoute,
  path: "/explore",
});

export { exploreRoute };
