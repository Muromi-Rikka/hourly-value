import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "@/routes/__root";
import { aboutRoute } from "@/routes/about";
import { exploreRoute } from "@/routes/explore";
import { indexRoute } from "@/routes/index";
import { iphoneRoute } from "@/routes/iphone";
import { iphoneExploreRoute } from "@/routes/iphone-explore";

const routeTree = rootRoute.addChildren([indexRoute, exploreRoute, aboutRoute, iphoneRoute, iphoneExploreRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { router };
