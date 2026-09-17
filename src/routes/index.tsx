import { createRoute } from "@tanstack/react-router";
import { Home } from "@/pages/home";
import { rootRoute } from "@/routes/__root";

const indexRoute = createRoute({
  component: Home,
  getParentRoute: () => rootRoute,
  path: "/",
});

export { indexRoute };
