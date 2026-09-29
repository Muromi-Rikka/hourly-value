import { Star } from "lucide-react";
import * as React from "react";

import { compactNumber } from "@/lib/format";
import { cn } from "@/lib/utilities";

interface GitHubStarButtonProperties {
  className?: string;
}

const REPO_HREF = "https://github.com/Muromi-Rikka/hourly-value";
const REPO_API = "https://api.github.com/repos/Muromi-Rikka/hourly-value";

/**
 * 点星数单飞：整个页面生命周期只打一次接口 —— StrictMode 双挂载、路由切换
 * 都复用同一个 promise（GitHub 匿名接口按 IP 限流 60 次/小时）。
 */
const starCache: { pending?: Promise<null | number> } = {};

/**
 * 报头右上角的「点星」入口。静态站拿不到用户的 GitHub 授权，点不进 star API，
 * 所以它是一枚通往仓库的印章式链接：
 * 静置是纸面上的一道墨边星形，悬停/聚焦时朱红填星并微转（盖章的手感），
 * 计数用 Instrument Serif 配一条栏线，数字沿用账簿口径。
 */
export function GitHubStarButton({ className }: GitHubStarButtonProperties) {
  const [stars, setStars] = React.useState<null | number>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function resolveStars() {
      if (starCache.pending === undefined) {
        starCache.pending = loadStars();
      }
      const value = await starCache.pending;
      if (isMounted) {
        setStars(value);
      }
    }
    void resolveStars();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <a
      aria-label={stars === null ? "在 GitHub 上查看本项目" : `在 GitHub 上给本项目点个 Star（当前 ${stars}）`}
      className={cn(
        "group inline-flex h-8 shrink-0 items-center gap-2 rounded-full border border-border bg-surface/50 pr-2.5 pl-2.5",
        "text-muted-foreground transition-[color,background-color,border-color,scale] duration-200",
        "hover:border-stamp/45 hover:bg-stamp/10 hover:text-foreground",
        "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ring",
        "motion-safe:active:scale-[0.96]",
        className,
      )}
      href={REPO_HREF}
      rel="noreferrer"
      target="_blank"
      title="在 GitHub 上给这个项目点个 Star"
    >
      <Star
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 transition-[fill,color,rotate,scale] duration-200 group-hover:fill-stamp group-hover:text-stamp group-focus-visible:fill-stamp group-focus-visible:text-stamp motion-safe:group-hover:-rotate-[8deg] motion-safe:group-hover:scale-110"
        strokeWidth={1.75}
      />
      <span className="hidden text-[11px] font-medium tracking-[0.1em] uppercase sm:inline">Star</span>
      {stars !== null && (
        <>
          <span aria-hidden="true" className="hidden h-3.5 w-px bg-border sm:block" />
          <span className="stat-number text-sm text-foreground">{compactNumber(stars)}</span>
        </>
      )}
    </a>
  );
}

/**
 * 点星数。拉不到（离线 / 限流 / 接口改了）一律 null：
 * 缺数据是 null 而不是 0 —— 0 颗星会冒充「有人统计过、结果就是 0」。
 */
async function loadStars(): Promise<null | number> {
  try {
    const response = await fetch(REPO_API, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) {
      return null;
    }
    const payload: { stargazers_count?: number } = await response.json();
    const stars = payload?.stargazers_count;
    return typeof stars === "number" ? stars : null;
  }
  catch {
    return null;
  }
}
