import { createRoute } from "@tanstack/react-router";

import { IPhone } from "@/pages/iphone";
import { rootRoute } from "@/routes/__root";

export const iphoneRoute = createRoute({
  component: IPhone,
  getParentRoute: () => rootRoute,
  path: "/iphone",
});
