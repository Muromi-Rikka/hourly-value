import { createRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/seo";
import { Home } from "@/pages/home";
import { rootRoute } from "@/routes/__root";

const indexRoute = createRoute({
  component: Home,
  getParentRoute: () => rootRoute,
  head: () => routeHead("/"),
  path: "/",
});

export { indexRoute };
