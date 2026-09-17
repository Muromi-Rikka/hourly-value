import { Link } from "@tanstack/react-router";
import { ArrowRight, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WageBarChart } from "@/components/wage-bar-chart";
import { sortedByWage } from "@/data/wages";

export function Home() {
  const highest = sortedByWage[0];
  const lowest = sortedByWage[sortedByWage.length - 1];
  const count = sortedByWage.length;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-6 pt-4">
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-normal tracking-tight sm:text-4xl lg:text-5xl">
            全球最低工资购买力对比
          </h1>
          <p className="max-w-2xl text-muted-foreground text-base leading-relaxed sm:text-lg">
            以人民币折算时薪为统一基准，直观展示
            {" "}
            {count}
            {" "}
            个国家/地区的最低工资差异。
            数据覆盖亚洲、欧洲、大洋洲和北美，时效 2025-2026 年。
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">各地区最低时薪（人民币）排名</h2>
          <WageBarChart data={sortedByWage} layout="horizontal" />
        </div>
      </section>

      {/* Insight cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">最高时薪</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥
              {highest.cnyEquivalent}
            </div>
            <p className="text-xs text-muted-foreground">
              {highest.country}
              {" "}
              ·
              {highest.localWage}
              {" "}
              {highest.localUnit}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">最低时薪</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥
              {lowest.cnyEquivalent}
            </div>
            <p className="text-xs text-muted-foreground">
              {lowest.country}
              {" "}
              ·
              {lowest.localWage}
              {" "}
              {lowest.localUnit}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">覆盖国家</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count}</div>
            <p className="text-xs text-muted-foreground">
              亚洲 · 欧洲 · 大洋洲 · 北美
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="flex justify-center">
        <Button asChild size="lg">
          <Link to="/explore">
            开始探索数据
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
