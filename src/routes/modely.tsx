import { createRoute } from "@tanstack/react-router";

import { ModelY } from "@/pages/modely";
import { rootRoute } from "@/routes/__root";

export const modelyRoute = createRoute({
  component: ModelY,
  getParentRoute: () => rootRoute,
  path: "/modely",
});
