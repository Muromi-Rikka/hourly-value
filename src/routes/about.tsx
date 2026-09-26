import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { routeHead } from "@/lib/seo";
import { rootRoute } from "@/routes/__root";

const aboutRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/about"), "About"),
  getParentRoute: () => rootRoute,
  head: () => routeHead("/about"),
  path: "/about",
});

export { aboutRoute };
