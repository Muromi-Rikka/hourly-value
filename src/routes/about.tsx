import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";

const aboutRoute = createRoute({
  component: lazyRouteComponent(() => import("@/pages/about"), "About"),
  getParentRoute: () => rootRoute,
  path: "/about",
});

export { aboutRoute };
