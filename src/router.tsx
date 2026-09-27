import { createRouter } from "@tanstack/react-router";
import { RouteError, RoutePending } from "@/components/route-status";
import { rootRoute } from "@/routes/__root";
import { aboutRoute } from "@/routes/about";
import { bigmacRoute } from "@/routes/bigmac";
import { bigmacExploreRoute } from "@/routes/bigmac-explore";
import { commodityRoute } from "@/routes/commodity";
import { commodityExploreRoute } from "@/routes/commodity-explore";
import { exploreRoute } from "@/routes/explore";
import { hourlyRoute } from "@/routes/hourly";
import { indexRoute } from "@/routes/index";
import { iphoneRoute } from "@/routes/iphone";
import { iphoneExploreRoute } from "@/routes/iphone-explore";
import { modelyRoute } from "@/routes/modely";
import { modelyExploreRoute } from "@/routes/modely-explore";

const routeTree = rootRoute.addChildren([indexRoute, hourlyRoute, exploreRoute, aboutRoute, iphoneRoute, iphoneExploreRoute, bigmacRoute, bigmacExploreRoute, commodityRoute, commodityExploreRoute, modelyRoute, modelyExploreRoute]);

const router = createRouter({
  defaultErrorComponent: RouteError,
  defaultPendingComponent: RoutePending,
  routeTree,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { router };
