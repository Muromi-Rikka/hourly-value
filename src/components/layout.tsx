import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUp, BarChart3, Globe, Info, Menu, X } from "lucide-react";
import * as React from "react";

import { GitHubStarButton } from "@/components/github-star-button";
import { Button } from "@/components/ui/button";
import { ratesUpdatedAt } from "@/data/exchange-rates";
import { wages } from "@/data/wages";
import { shouldReduceMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utilities";

/**
 * 单一数据入口（首页/落地页）；short 供 md–lg 窄宽度导航使用。
 * 「一小时购买力」是主线，排在五个指数之前。
*/
const indexItems = [
  { href: "/hourly", label: "一小时购买力", short: "一小时" },
  { href: "/explore", label: "最低工资", short: "最低工资" },
  { href: "/iphone", label: "iPhone 指数", short: "iPhone" },
  { href: "/bigmac", label: "巨无霸指数", short: "巨无霸" },
  { href: "/commodity", label: "物资指数", short: "物资" },
  { href: "/modely", label: "Model Y 指数", short: "Model Y" },
];

const copyrightYear = new Date().getFullYear();

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  // 抽屉只有内部链接会自己关；点页面里的 CTA 或浏览器前进/后退都不走那些 onClick，
  // 因此路径一变就收起（Layout 挂在 __root，不会随路由卸载，状态不会自愈）。
  //
  // 用「渲染期比对上一次路径」而不是 useEffect：effect 里同步 setState 会多跑一次
  // 渲染，且违反 react/set-state-in-effect。React 官方推荐的调整状态写法就是
  // 在渲染中比对并 setState —— 它会在提交前重渲，用户看不到中间态。
  const [lastPathname, setLastPathname] = React.useState(location.pathname);
  if (lastPathname !== location.pathname) {
    setLastPathname(location.pathname);
    setMobileOpen(false);
  }

  return (
    <div className="min-h-dvh bg-background font-sans text-foreground antialiased">
      <div aria-hidden="true" className="grain" />
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-foreground" href="#main">
        跳到主要内容
      </a>

      <header className="rule-double-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-2 font-semibold" to="/">
            <span className="rounded-full bg-primary/10 p-1.5">
              <Globe className="h-5 w-5 text-primary" />
            </span>
            <span className="font-display text-base">全球最低工资对比</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            <Link
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors hover:text-primary",
                location.pathname === "/" && "bg-primary/10 font-medium text-primary",
              )}
              to="/"
            >
              首页
            </Link>

            <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
            {indexItems.map(item => (
              <IndexLink
                href={item.href}
                key={item.href}
                label={item.label}
                pathname={location.pathname}
                short={item.short}
              />
            ))}
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />

            <Link
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors hover:text-primary",
                location.pathname === "/about" && "bg-primary/10 font-medium text-primary",
              )}
              to="/about"
            >
              关于
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <GitHubStarButton />
            <Button
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              size="icon"
              variant="ghost"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t md:hidden">
            <Link
              className={cn(
                "block px-4 py-4 text-sm transition-colors hover:text-primary",
                location.pathname === "/" && "border-l-2 border-primary bg-primary/5 font-medium text-primary pl-3.5",
              )}
              onClick={() => setMobileOpen(false)}
              to="/"
            >
              首页
            </Link>

            <p className="border-t px-4 pt-4 pb-1 text-xs text-muted-foreground">数据</p>
            {indexItems.map(item => (
              <Link
                className={cn(
                  "block px-4 py-3 pl-6 text-sm transition-colors hover:text-primary",
                  location.pathname === item.href && "border-l-2 border-primary bg-primary/5 font-medium text-primary pl-[1.375rem]",
                )}
                key={item.href}
                onClick={() => setMobileOpen(false)}
                to={item.href}
              >
                {item.label}
              </Link>
            ))}

            <Link
              className={cn(
                "block border-t px-4 py-4 text-sm transition-colors hover:text-primary",
                location.pathname === "/about" && "border-l-2 border-primary bg-primary/5 font-medium text-primary pl-3.5",
              )}
              onClick={() => setMobileOpen(false)}
              to="/about"
            >
              关于
            </Link>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6" id="main">
        {children}
      </main>

      <footer className="rule-double bg-muted/50 text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Left — Logo & description */}
            <div>
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <span className="rounded-full bg-primary/10 p-1.5">
                  <Globe className="h-4 w-4 text-primary" />
                </span>
                <span className="font-display text-base">全球最低工资对比</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed">
                数据来源：各国政府官方机构 · 2025-2026 · 已收录
                {" "}
                {wages.length}
                {" 个国家/地区"}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed opacity-80">
                税前法定最低工资，按
                {" "}
                {ratesUpdatedAt}
                {" 市场汇率折算人民币，不等于购买力平价"}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>购买力可视化</span>
              </div>
            </div>

            {/* Center — Data sources */}
            <div>
              <h2 className="mb-3 text-xs font-medium text-foreground">数据来源</h2>
              <ul className="space-y-1.5 text-xs">
                {wages.slice(0, 4).map(entry => (
                  <li className="flex items-center gap-1.5" key={entry.countryCode}>
                    <Info className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                    <span>{entry.source}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Quick links */}
            <div>
              <h2 className="mb-3 text-xs font-medium text-foreground">快速导航</h2>
              <ul className="space-y-1.5 text-xs">
                {[...indexItems, { href: "/about", label: "关于" }].map(item => (
                  <li key={item.href}>
                    <Link className="transition-colors hover:text-primary" to={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center gap-3 border-t border-border/50 pt-5 sm:flex-row sm:justify-between">
            <span className="text-xs">
              ©
              {" "}
              {copyrightYear}
              {" "}
              Muromi-Rikka · 数据来源：各国政府官方机构
            </span>
            <Button
              aria-label="回到顶部"
              className="h-7 w-7 rounded-full"
              onClick={() => scrollTo({ behavior: shouldReduceMotion() ? "auto" : "smooth", top: 0 })}
              size="icon"
              variant="outline"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IndexLink({ href, label, pathname, short }: { href: string; label: string; pathname: string; short: string }) {
  const active = pathname === href || pathname.startsWith(`${href}-`);

  return (
    <Link
      className={cn(
        "rounded-full px-3 py-1.5 text-sm transition-colors hover:text-primary",
        active && "bg-primary/10 font-medium text-primary",
      )}
      to={href}
    >
      <span className="hidden lg:inline">{label}</span>
      <span className="lg:hidden">{short}</span>
    </Link>
  );
}
