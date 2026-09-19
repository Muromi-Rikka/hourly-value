import { createRoute } from "@tanstack/react-router";

import { ModelYExplore } from "@/pages/modely-explore";
import { rootRoute } from "@/routes/__root";

export const modelyExploreRoute = createRoute({
  component: ModelYExplore,
  getParentRoute: () => rootRoute,
  path: "/modely-explore",
});
