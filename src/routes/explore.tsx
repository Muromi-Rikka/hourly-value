import { createRoute } from "@tanstack/react-router";
import { Explore } from "@/pages/explore";
import { rootRoute } from "@/routes/__root";

const exploreRoute = createRoute({
  component: Explore,
  getParentRoute: () => rootRoute,
  path: "/explore",
});

export { exploreRoute };
