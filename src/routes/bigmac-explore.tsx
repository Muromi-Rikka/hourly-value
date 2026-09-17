import { createRoute } from "@tanstack/react-router";

import { BigMacExplore } from "@/pages/bigmac-explore";
import { rootRoute } from "@/routes/__root";

export const bigmacExploreRoute = createRoute({
  component: BigMacExplore,
  getParentRoute: () => rootRoute,
  path: "/bigmac-explore",
});
