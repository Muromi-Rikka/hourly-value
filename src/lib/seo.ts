import type { DetailedHTMLProps, LinkHTMLAttributes, MetaHTMLAttributes } from "react";

/**
 * 全站 metadata 的唯一出口。
 *
 * 分工（纯 CSR SPA 没有 SSR，必须两套并存且不能重复）：
 * - `index.html` 静态标签负责社交爬虫（FB/TW/微信不执行 JS）：og:*、twitter:*、JSON-LD、图标。
 *   其中 title/description 标了 `data-static-fallback`，挂载后由根路由删掉，避免与下面这套重复。
 * - 本模块经 TanStack Router 的 `head` 负责 JS 侧：title、description、canonical 随路由变化。
 *
 * 注意：canonical 只由叶子路由下发，根路由不发 —— 否则 flatMap 会得到两条 link[rel=canonical]。
 */

/**
 * 站点线上地址：canonical / og:image / sitemap 的唯一来源
*/
export const SITE_URL = "https://hourly-value.pages.dev";

/**
 * 站点名，与 header/footer 品牌一致
*/
export const SITE_NAME = "全球最低工资对比";

/**
 * 站点一句话定位，静态 og 与结构化数据共用
*/
export const SITE_TAGLINE = "同样工作 1 小时，各国最低工资能买到什么";

export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

export const DEFAULT_TITLE = `一小时能买什么？· ${SITE_NAME}`;

export const DEFAULT_DESCRIPTION
  = "以人民币为统一基准，对比 27 个国家/地区的法定最低时薪能买到什么，并用巨无霸、基础物资、iPhone、Model Y 四类消费品交叉验证。";

interface PageSeo {
  description: string;
  title: string;
}

/**
 * 12 条路由的 title/description。标题统一 `{页面} · {站点名}` 格式。
 * 新增路由时先在这里补一条，再到 route 里调 `routeHead(path)`。
 */
export const ROUTE_SEO: Record<string, PageSeo> = {
  "/": {
    description:
      "以人民币为统一基准，对比 27 个国家/地区的法定最低时薪能买到什么，并用巨无霸、基础物资、iPhone、Model Y 四类消费品交叉验证。",
    title: `一小时能买什么？· ${SITE_NAME}`,
  },
  "/about": {
    description:
      "数据来源、工资口径、汇率折算与工时假设的完整说明，以及五项指数的方法论与更新时间。",
    title: `关于本项目 · ${SITE_NAME}`,
  },
  "/bigmac": {
    description:
      "用当地最低时薪除以当地巨无霸售价，全程本币相除不过汇率，直观体现最低工资的实际购买力。",
    title: `巨无霸指数 · ${SITE_NAME}`,
  },
  "/bigmac-explore": {
    description:
      "巨无霸指数完整数据表：一小时能买几个、当地价格与美元估值偏差，可排序筛选并展开来源。",
    title: `巨无霸数据探索 · ${SITE_NAME}`,
  },
  "/commodity": {
    description:
      "用最低时薪购买 9 件基础食品篮（米、面、油、肉、蛋、奶等）需要工作多少小时，覆盖 27 个国家/地区。",
    title: `物资指数 · ${SITE_NAME}`,
  },
  "/commodity-explore": {
    description:
      "物资指数完整数据表：各国篮子总价、所需工时与价格快照日期，可排序筛选并展开逐项价格。",
    title: `物资数据探索 · ${SITE_NAME}`,
  },
  "/explore": {
    description:
      "27 个国家/地区的法定最低时薪折合人民币，可排序、筛选并展开查看数据来源与工时折算口径。",
    title: `最低工资数据探索 · ${SITE_NAME}`,
  },
  "/hourly": {
    description:
      "选两个国家逐项对比一小时工资的购买力：最低工资、巨无霸、物资篮、iPhone、Model Y 五项指标一张矩阵看完。",
    title: `一小时购买力 · ${SITE_NAME}`,
  },
  "/iphone": {
    description:
      "以各国最低时薪计算买一台 iPhone 需要工作多少小时，数据来自 Apple 官方商城，含税口径各国不同。",
    title: `iPhone 指数 · ${SITE_NAME}`,
  },
  "/iphone-explore": {
    description:
      "iPhone 指数完整数据表：各国所需工时、当地价格与官方商城链接，可排序筛选并展开逐条说明。",
    title: `iPhone 数据探索 · ${SITE_NAME}`,
  },
  "/modely": {
    description:
      "以各国法定最低时薪购买一辆 Tesla Model Y 需要工作多少小时，按官网标价折算，跨地区以小时为准。",
    title: `Model Y 指数 · ${SITE_NAME}`,
  },
  "/modely-explore": {
    description:
      "Model Y 指数完整数据表：各国所需工时与当地售价，可排序筛选并展开口径说明。",
    title: `Model Y 数据探索 · ${SITE_NAME}`,
  },
};

/**
 * 首页路径，`/` 的 canonical 结尾带斜杠
*/
const HOME_PATH = "/";

type HeadLink = DetailedHTMLProps<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement> | undefined;

/**
 * 与 TanStack `head` 期望的形状完全一致（见 router-core `HeadFn`）
*/
type HeadMeta = DetailedHTMLProps<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement> | undefined;
/**
 * 叶子路由的规范地址：去掉 query，保证分享链接只规范化到路径
*/
export function canonicalUrl(path: string): string {
  const pathname = path === HOME_PATH ? "/" : path;
  return new URL(pathname, SITE_URL).href;
}

/**
 * 根路由兜底：只给 title/description，不发 canonical。
 * 根因：TanStack 对 links 只按整体去重，根路由一旦也发 canonical，就会和子路由的那条并存。
 */
export function defaultHead(): { meta: HeadMeta[] } {
  return { meta: seoMeta(DEFAULT_TITLE, DEFAULT_DESCRIPTION) };
}

/**
 * 叶子路由：title + description + canonical + og:url（四者必须一致）
*/
export function routeHead(path: string): { links: HeadLink[]; meta: HeadMeta[] } {
  const { description, title } = pageSeo(path);
  const canonical = canonicalUrl(path);
  return {
    links: [{ href: canonical, rel: "canonical" }],
    meta: [...seoMeta(title, description), { content: canonical, property: "og:url" }],
  };
}

function pageSeo(path: string): PageSeo {
  return ROUTE_SEO[path] ?? { description: DEFAULT_DESCRIPTION, title: DEFAULT_TITLE };
}

function seoMeta(title: string, description: string): HeadMeta[] {
  return [{ title }, { content: description, name: "description" }];
}
