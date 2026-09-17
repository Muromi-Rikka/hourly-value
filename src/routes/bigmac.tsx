import { createRoute } from "@tanstack/react-router";

import { BigMac } from "@/pages/bigmac";
import { rootRoute } from "@/routes/__root";

export const bigmacRoute = createRoute({
  component: BigMac,
  getParentRoute: () => rootRoute,
  path: "/bigmac",
});
