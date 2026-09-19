import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUp, BarChart3, Globe, Info, Menu, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { wages } from "@/data/wages";
import { cn } from "@/lib/utilities";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/explore", label: "数据探索" },
  { href: "/iphone", label: "iPhone指数" },
  { href: "/bigmac", label: "巨无霸指数" },
  { href: "/commodity", label: "物资指数" },
  { href: "/modely", label: "Model Y指数" },
  { href: "/about", label: "关于" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const wideRoutes = ["/explore", "/iphone-explore", "/bigmac-explore", "/commodity-explore", "/modely-explore"];
  const mainMaxWidth = wideRoutes.includes(location.pathname) ? "max-w-6xl" : "max-w-5xl";

  return (
    <div className="min-h-dvh bg-background font-sans text-foreground antialiased">
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-foreground" href="#main">
        跳到主要内容
      </a>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-2 font-semibold" to="/">
            <span className="rounded-full bg-primary/10 p-1.5">
              <Globe className="h-5 w-5 animate-[spin_12s_linear_infinite] text-primary" />
            </span>
            <span className="font-display text-base">全球最低工资对比</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(item => (
              <Link
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm transition-colors hover:text-primary",
                  location.pathname === item.href && "font-medium text-primary",
                )}
                key={item.href}
                to={item.href}
              >
                {item.label}
                {location.pathname === item.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </nav>

          <Button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            size="icon"
            variant="ghost"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <nav className="border-t md:hidden">
            {navItems.map(item => (
              <Link
                className={cn(
                  "block px-4 py-4 text-sm transition-colors hover:text-primary",
                  location.pathname === item.href && "border-l-2 border-primary bg-primary/5 font-medium text-primary pl-3.5",
                )}
                key={item.href}
                onClick={() => setMobileOpen(false)}
                to={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className={cn("mx-auto px-4 py-8 sm:px-6", mainMaxWidth)} id="main">
        {children}
      </main>

      <footer className="border-t bg-muted/50 text-sm text-muted-foreground">
        <div className="gradient-accent" />
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
                数据来源：各国政府官方机构 · 2025-2026
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>购买力可视化</span>
              </div>
            </div>

            {/* Center — Data sources */}
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground">数据来源</h3>
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
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground">快速导航</h3>
              <ul className="space-y-1.5 text-xs">
                {navItems.slice(0, 5).map(item => (
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
            <span className="text-xs">© 2025 · Built with React + Tailwind</span>
            <Button
              className="h-7 w-7 rounded-full"
              onClick={() => scrollTo({ behavior: "smooth", top: 0 })}
              size="icon"
              variant="outline"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span className="sr-only">回到顶部</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
