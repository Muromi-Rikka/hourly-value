import { createRoute } from "@tanstack/react-router";

import { Commodity } from "@/pages/commodity";
import { rootRoute } from "@/routes/__root";

export const commodityRoute = createRoute({
  component: Commodity,
  getParentRoute: () => rootRoute,
  path: "/commodity",
});
