import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUp, BarChart3, Globe, Menu, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utilities";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/explore", label: "数据探索" },
  { href: "/iphone", label: "iPhone指数" },
  { href: "/bigmac", label: "巨无霸指数" },
  { href: "/commodity", label: "物资指数" },
  { href: "/about", label: "关于" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const wideRoutes = ["/explore", "/iphone-explore", "/bigmac-explore", "/commodity-explore"];
  const mainMaxWidth = wideRoutes.includes(location.pathname) ? "max-w-6xl" : "max-w-5xl";

  return (
    <div className="min-h-dvh bg-background font-sans text-foreground antialiased">
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-foreground" href="#main">
        跳到主要内容
      </a>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-2 font-semibold" to="/">
            <Globe className="h-5 w-5 animate-[spin_12s_linear_infinite] text-primary" />
            <span className="text-sm">全球最低工资对比</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(item => (
              <Link
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href && "bg-accent font-medium text-accent-foreground",
                )}
                key={item.href}
                to={item.href}
              >
                {item.label}
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
                  "block px-4 py-3 text-sm transition-colors hover:bg-accent",
                  location.pathname === item.href && "bg-accent font-medium",
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

      <footer className="border-t bg-muted/50 py-6 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <span>数据来源：各国政府官方机构 · 2025-2026</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                全球最低工资购买力可视化
              </span>
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
        </div>
      </footer>
    </div>
  );
}
