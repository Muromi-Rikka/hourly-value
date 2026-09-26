import type { ColumnFiltersState } from "@tanstack/react-table";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Search } from "lucide-react";
import * as React from "react";
import type { DataTableColumn } from "@/components/data-table";
import type { HourlyMetric, HourlyPowerEntry } from "@/data/hourly-power";
import type { HourlySearch } from "@/routes/hourly";

import { CountryFlag } from "@/components/country-flag";
import { CoverageBadge } from "@/components/coverage-badge";
import { ExploreView } from "@/components/explore-view";
import { HourlyCompare } from "@/components/hourly-compare";
import { createHourlyPowerTooltip } from "@/components/index-tooltips";
import { MethodNotes } from "@/components/method-notes";
import { RankBarChart } from "@/components/rank-bar-chart";
import { AnimatedContent } from "@/components/react-bits/AnimatedContent/AnimatedContent";
import { SplitText } from "@/components/react-bits/SplitText/SplitText";
import { Button } from "@/components/ui/button";
import {
  commonCodes,
  commonHourlyPower,
  HOURLY_METRICS,
  hourlyPower,
  hourlyPowerOf,
  metricFor,
  workWeeks,
} from "@/data/hourly-power";
import { SCOPE_CHIPS } from "@/data/methodology";
import { cnyHour, DASH, dateOnly, hourNumber, localAmount, round1 } from "@/lib/format";
import { regionAverages } from "@/lib/region";
import { cn } from "@/lib/utilities";
import { hourlyRoute } from "@/routes/hourly";

const DEFAULT_A = "CN";
const DEFAULT_B = "DE";

const columns: DataTableColumn<HourlyPowerEntry>[] = [
  {
    accessorFn: row => row.country,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 font-medium">
        <CountryFlag className="h-4 w-4" countryCode={row.original.countryCode} />
        {row.original.country}
      </span>
    ),
    header: "国家",
    id: "country",
  },
  {
    accessorFn: row => row.region,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.region}</span>,
    filterFn: "equalsString",
    header: "区域",
    id: "region",
  },
  {
    accessorFn: row => row.coverage,
    cell: ({ row }) => <CoverageBadge coverage={row.original.coverage} />,
    filterFn: "equals",
    header: "数据",
    id: "coverage",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.cnyHour,
    cell: ({ row }) => <span className="stat-number text-primary">{cnyHour(row.original.cnyHour)}</span>,
    header: "人民币时薪",
    id: "cnyHour",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.bigMacPerHour,
    cell: ({ row }) => <span className="stat-number">{numberOrDash(row.original.bigMacPerHour)}</span>,
    header: "1 小时能买巨无霸",
    id: "bigMacPerHour",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.basketHours,
    cell: ({ row }) => <span className="stat-number">{numberOrDash(row.original.basketHours)}</span>,
    header: "买物资篮",
    id: "basketHours",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.iphoneHours,
    cell: ({ row }) => <span className="stat-number">{numberOrDash(row.original.iphoneHours)}</span>,
    header: "买 iPhone",
    id: "iphoneHours",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.modelyHours,
    cell: ({ row }) => <span className="stat-number">{numberOrDash(row.original.modelyHours)}</span>,
    header: "买 Model Y",
    id: "modelyHours",
    sortFn: "basic",
  },
  {
    accessorFn: row => row.effectiveDate,
    cell: ({ row }) => <span className="text-muted-foreground">{dateOnly(row.original.effectiveDate)}</span>,
    header: "工资生效",
    id: "effectiveDate",
  },
];

interface TableToolbarProperties {
  coverage: string;
  onCoverage: (value: string) => void;
  onQuery: (value: string) => void;
  onRegion: (region: string) => void;
  onScope: (scope: "all" | "common") => void;
  query: string;
  region: string;
  scope: "all" | "common";
}

export function Hourly() {
  const search = hourlyRoute.useSearch();
  const navigate = useNavigate({ from: hourlyRoute.fullPath });

  const setSearch = React.useCallback((patch: Partial<HourlySearch>) => {
    void navigate({ search: previous => ({ ...previous, ...patch }) });
  }, [navigate]);

  const a = hourlyPowerOf(search.a ?? DEFAULT_A) ?? hourlyPowerOf(DEFAULT_A)!;
  const b = hourlyPowerOf(search.b ?? DEFAULT_B) ?? hourlyPowerOf(DEFAULT_B)!;
  const metric = metricFor(search.metric as HourlyMetric["key"]) ?? HOURLY_METRICS[1];
  const isCommonOnly = search.scope === "common";
  const scope: "all" | "common" = isCommonOnly ? "common" : "all";

  const [query, setQuery] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const options = isCommonOnly ? commonHourlyPower : hourlyPower;

  const searched = React.useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return options;
    }
    return options.filter(entry =>
      entry.country.toLowerCase().includes(keyword)
      || entry.countryCode.toLowerCase().includes(keyword),
    );
  }, [options, query]);

  const regionFilter = columnFilters.find(filter => filter.id === "region")?.value;
  const coverageFilter = columnFilters.find(filter => filter.id === "coverage")?.value;

  const setRegion = (region: string) => {
    setColumnFilters(previous => toggleFilter(previous, "region", region || undefined));
  };
  const setCoverage = (value: string) => {
    setColumnFilters(previous => toggleFilter(previous, "coverage", value === "5" ? 5 : undefined));
  };
  const setSearchScope = (next: "all" | "common") => {
    setSearch({ scope: next === "common" ? "common" : undefined });
  };

  const shareHref = `/hourly?a=${a.countryCode}&b=${b.countryCode}&metric=${metric.key}&scope=${scope}`;

  const ranked = React.useMemo(
    () =>
      options
        .filter(entry => metric.get(entry) !== null)
        .toSorted((x, y) => {
          const left = metric.get(x) ?? 0;
          const right = metric.get(y) ?? 0;
          return metric.higherIsBetter ? right - left : left - right;
        }),
    [metric, options],
  );
  // 稳定引用：每次渲染都新建 tooltip 组件会让 Recharts 反复卸载重挂
  const HourlyTooltip = React.useMemo(() => createHourlyPowerTooltip(metric, ranked), [metric, ranked]);

  const regionData = regionAverages(
    searched.filter(entry => metric.get(entry) !== null),
    entry => metric.get(entry) ?? 0,
    { decimals: 1, order: metric.higherIsBetter ? "desc" : "asc" },
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pb-10 pt-6 sm:pb-14 sm:pt-8">
        <div className="rule-top mb-6" />
        <SplitText
          className="max-w-3xl font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.03em]"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          tag="h1"
          text="一小时能买什么"
        />
        <AnimatedContent delay={0.15} distance={30} duration={0.6}>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            同样工作
            {" "}
            1
            {" 小时"}
            ，各国的法定最低工资能买到的东西并不一样。选两个国家，逐项比一比。
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {SCOPE_CHIPS.map(chip => (
              <span className="rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </AnimatedContent>
      </section>

      {/* Compare — the thesis of the page */}
      <AnimatedContent delay={0.1} distance={40} duration={0.6}>
        <HourlyCompare
          a={a}
          b={b}
          onChange={(side, code) => setSearch(side === "a" ? { a: code } : { b: code })}
          onSwap={() => setSearch({ a: b.countryCode, b: a.countryCode })}
          options={options}
          shareHref={shareHref}
        />
      </AnimatedContent>

      {/* Matrix */}
      <AnimatedContent delay={0.1} distance={40} duration={0.6} threshold={0.05}>
        {/* key 跟随当前指标：切换排行指标时表格同步换成该指标的默认排序 */}
        <div className="mt-12 sm:mt-16" key={metric.key}>
          <ExploreView
            chart={(
              <RankBarChart
                data={ranked}
                formatTick={metric.formatAxis}
                formatValue={metric.format}
                layout="horizontal"
                tooltip={HourlyTooltip}
                valueKey={metric.key}
              />
            )}
            chartCaption={`${metric.label} · 数值越大${metric.higherIsBetter ? "表示" : "越不表示"}购买力强${
              metric.higherIsBetter ? "，越高越好" : "，越低越好"
            }`}
            chartControls={<MetricSwitcher activeKey={metric.key} onChange={key => setSearch({ metric: key })} />}
            columnFilters={columnFilters}
            columns={columns}
            data={searched}
            defaultSort={[{ desc: metric.higherIsBetter, id: metric.key }]}
            description={(
              <>
                {searched.length}
                {" 个国家/地区在同一张表里对照。展开任意一行可看该国的工时折算口径与来源。"}
              </>
            )}
            onColumnFiltersChange={setColumnFilters}
            renderExpanded={row => <DetailPanel entry={row} />}
            title="各国一小时购买力矩阵"
            toolbar={(
              <TableToolbar
                coverage={coverageFilter === undefined ? "" : String(coverageFilter)}
                onCoverage={setCoverage}
                onQuery={setQuery}
                onRegion={setRegion}
                onScope={setSearchScope}
                query={query}
                region={regionFilter === undefined ? "" : String(regionFilter)}
                scope={scope}
              />
            )}
          />
        </div>
      </AnimatedContent>

      {/* Region medians */}
      <AnimatedContent delay={0.1} distance={40} duration={0.6} threshold={0.1}>
        <section className="mt-12 sm:mt-16">
          <p className="text-xs font-medium tracking-wider text-muted-foreground">区域中位数</p>
          <h2 className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-normal leading-tight">
            各区域的
            {metric.label}
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            中位数不受极值国家影响；括号内为该区域参与统计的国家数
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regionData.map(row => (
              <div className="rounded-xl border bg-card p-4" key={row.region}>
                <p className="text-sm font-medium">
                  {row.region}
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    （
                    {row.count}
                    {" 国）"}
                  </span>
                </p>
                <p className="stat-number mt-1 text-xl text-primary">
                  {metric.format(row.median)}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  均值
                  {" "}
                  {metric.format(row.avg)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedContent>

      {/* Methodology */}
      <AnimatedContent delay={0.1} distance={40} duration={0.6} threshold={0.1}>
        <div className="mt-12 sm:mt-16">
          <MethodNotes title="这些数字该怎么读" />
        </div>
      </AnimatedContent>

      {/* Coverage note */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6} threshold={0.1}>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          五项数据齐备的有
          {" "}
          {commonCodes.length}
          {" 个国家/地区（"}
          {commonCodes.map(code => hourlyPowerOf(code)?.country).filter(Boolean).join("、")}
          ）。其余国家至少缺一项，表格里的
          {" "}
          —
          {" 就是真的没有数据，不是买不起。"}
        </p>
      </AnimatedContent>

      {/* CTA to the five indices */}
      <AnimatedContent delay={0.1} distance={30} duration={0.6}>
        <section className="mt-12 pb-4 sm:mt-16">
          <p className="mb-4 text-xs font-medium tracking-wider text-muted-foreground">想看单个指数</p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/explore", label: "最低工资" },
              { href: "/bigmac", label: "巨无霸指数" },
              { href: "/commodity", label: "物资指数" },
              { href: "/iphone", label: "iPhone 指数" },
              { href: "/modely", label: "Model Y 指数" },
            ].map(item => (
              <Link key={item.href} to={item.href}>
                <Button size="sm" variant="outline">
                  {item.label}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </AnimatedContent>
    </div>
  );
}

function basisLabel(basis: "day" | "hour" | "month" | "week", statutoryHours: null | number): string {
  switch (basis) {
    case "day": {
      return `按日薪折算（每天 ${statutoryHours ?? "—"} 小时）`;
    }
    case "hour": {
      return "官方直接公布时薪";
    }
    case "month": {
      return `按月薪折算（每月 ${statutoryHours ?? "—"} 小时）`;
    }
    case "week": {
      return `按周薪折算（每周 ${statutoryHours ?? "—"} 小时）`;
    }
  }
}

function DetailPanel({ entry }: { entry: HourlyPowerEntry }) {
  return (
    <div className="border-l-2 border-primary/30 pl-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">当地最低时薪</p>
          <p className="text-sm">
            {localAmount(entry.localWage, entry.localUnit)}
            {" = "}
            {cnyHour(entry.cnyHour)}
            /小时
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            工资公布单位：
            {basisLabel(entry.hoursBasis, entry.statutoryHours)}
            {entry.isProxy ? " · 代理值" : ""}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">工时折算</p>
          <p className="text-sm">
            {entry.statutoryWeeklyHours === null
              ? "来源未明确周工时"
              : `法定每周 ${entry.statutoryWeeklyHours} 小时`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {workWeeks(entry, entry.modelyHours) === null
              ? "无法换算为工作周"
              : `买 Model Y 约 ${round1(workWeeks(entry, entry.modelyHours) ?? 0)} 个工作周`}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">生效日期</p>
          <p className="text-sm">{dateOnly(entry.effectiveDate)}</p>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="text-xs font-medium text-muted-foreground">来源</p>
          <a
            className="inline-flex items-center gap-1 break-all text-sm text-primary underline underline-offset-2"
            href={entry.wageSourceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {entry.wageSource}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="text-xs font-medium text-muted-foreground">各指标口径</p>
          <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
            {HOURLY_METRICS.map(metric => (
              <li key={metric.key}>
                <span className="text-foreground">
                  {metric.label}
                  ：
                </span>
                {metric.note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricSwitcher({ activeKey, onChange }: { activeKey: HourlyMetric["key"]; onChange: (key: HourlyMetric["key"]) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {HOURLY_METRICS.map(metric => (
        <Button
          className={cn(metric.key === activeKey && "border-primary text-primary")}
          key={metric.key}
          onClick={() => onChange(metric.key)}
          size="sm"
          variant="outline"
        >
          {metric.label}
        </Button>
      ))}
    </div>
  );
}

function numberOrDash(value: null | number): string {
  return value === null ? DASH : hourNumber(value);
}

function TableToolbar({
  coverage,
  onCoverage,
  onQuery,
  onRegion,
  onScope,
  query,
  region,
  scope,
}: TableToolbarProperties) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[10rem] flex-1 sm:max-w-xs">
        <Search aria-hidden="true" className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          aria-label="搜索国家"
          className="w-full rounded-lg border border-border bg-card py-2 pr-3 pl-8 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={event => onQuery(event.target.value)}
          placeholder="搜索国家"
          type="search"
          value={query}
        />
      </div>
      <select
        aria-label="按区域筛选"
        className="rounded-lg border border-border bg-card px-2.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onChange={event => onRegion(event.target.value)}
        value={region}
      >
        <option value="">全部区域</option>
        {["亚洲", "欧洲", "北美", "南美", "大洋洲", "中东"].map(name => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      <select
        aria-label="按数据完整度筛选"
        className="rounded-lg border border-border bg-card px-2.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onChange={event => onCoverage(event.target.value)}
        value={coverage}
      >
        <option value="">全部数据</option>
        <option value="5">五项齐备</option>
      </select>
      <Button
        aria-pressed={scope === "common"}
        onClick={() => onScope(scope === "common" ? "all" : "common")}
        size="sm"
        variant={scope === "common" ? "default" : "outline"}
      >
        只看五项齐备
        {" "}
        {commonCodes.length}
        {" 国"}
      </Button>
    </div>
  );
}

function toggleFilter(
  filters: ColumnFiltersState,
  id: string,
  value: number | string | undefined,
): ColumnFiltersState {
  const rest = filters.filter(filter => filter.id !== id);
  return value === undefined ? rest : [...rest, { id, value }];
}
