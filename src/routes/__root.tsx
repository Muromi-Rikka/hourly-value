import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import * as React from "react";
import { Layout } from "@/components/layout";
import { defaultHead } from "@/lib/seo";

/**
 * 删掉 `index.html` 里那两条静态兜底 title/description。
 *
 * 纯 CSR 下 React 会把新的 `<title>` 插到静态那条**前面**（React 19 的 mountHoistable 行为），
 * 不删就会同时存在两条 —— 必须只留 React 托管的一条。
 * 静态标签是给不执行 JS 的爬虫看的，它们根本不会跑到这段代码，所以两边各取所需。
 *
 * 只有当 React 确实已经下发了对应标签才删，避免 head 腾空。
 */
function useStripStaticFallback() {
  React.useEffect(() => {
    const head = document.head;
    const stripIfReplaced = (selector: string) => {
      const live = head.querySelector(`${selector}:not([data-static-fallback])`);
      if (live === null)
        return;
      for (const element of head.querySelectorAll(`${selector}[data-static-fallback]`)) element.remove();
    };

    stripIfReplaced("title");
    stripIfReplaced("meta[name=\"description\"]");
  }, []);
}

const rootRoute = createRootRoute({
  component: function Root() {
    useStripStaticFallback();
    return (
      <Layout>
        <HeadContent />
        <Outlet />
      </Layout>
    );
  },
  head: defaultHead,
});

export { rootRoute };
