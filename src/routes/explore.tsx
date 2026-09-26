import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

const exploreRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/explore"), "Explore"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/explore"),
  path: "/explore",
});

export { exploreRoute };
