import { Link, useLocation } from "@tanstack/react-router";
import { BarChart3, Globe, Menu, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utilities";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/explore", label: "数据探索" },
  { href: "/about", label: "关于" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans antialiased">
      <a className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:font-semibold" href="#main">
        跳到主要内容
      </a>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-2 font-semibold" to="/">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm">全球最低工资对比</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                className={cn(
                  "px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href && "bg-accent text-accent-foreground font-medium",
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

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6" id="main">
        {children}
      </main>

      <footer className="border-t bg-muted/50 py-6 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <span>数据来源：各国政府官方机构 · 2025-2026</span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              全球最低工资购买力可视化
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
