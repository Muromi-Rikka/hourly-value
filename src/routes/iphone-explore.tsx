import { createRoute } from "@tanstack/react-router";

import { IPhoneExplore } from "@/pages/iphone-explore";
import { rootRoute } from "@/routes/__root";

export const iphoneExploreRoute = createRoute({
  component: IPhoneExplore,
  getParentRoute: () => rootRoute,
  path: "/iphone-explore",
});
