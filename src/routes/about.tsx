import { createRoute } from "@tanstack/react-router";
import { About } from "@/pages/about";
import { rootRoute } from "@/routes/__root";

const aboutRoute = createRoute({
  component: About,
  getParentRoute: () => rootRoute,
  path: "/about",
});

export { aboutRoute };
