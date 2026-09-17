import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "@/components/layout";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

export { rootRoute };
