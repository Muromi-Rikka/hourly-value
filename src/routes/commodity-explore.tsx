import { createRoute } from "@tanstack/react-router";

import { CommodityExplore } from "@/pages/commodity-explore";
import { rootRoute } from "@/routes/__root";

export const commodityExploreRoute = createRoute({
  component: CommodityExplore,
  getParentRoute: () => rootRoute,
  path: "/commodity-explore",
});
