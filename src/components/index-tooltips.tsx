import type { RankTooltipProperties } from "@/components/rank-bar-chart";
import type { BigMacEntry } from "@/data/bigmac";
import type { BigMacPurchasingPower } from "@/data/bigmac-ppp";
import type { CommodityIndexEntry } from "@/data/commodity-index";
import type { HourlyMetric, HourlyPowerEntry } from "@/data/hourly-power";
import type { IPhoneIndexEntry } from "@/data/iphone-index";
import type { ModelYIndexEntry } from "@/data/modely-index";

import { TooltipShell } from "@/components/tooltip-shell";
import { sortedByValuation } from "@/data/bigmac";
import { sortedByBigMacPerHour } from "@/data/bigmac-ppp";
import { COMMODITY_SOURCE } from "@/data/commodity";
import { sortedByHours } from "@/data/commodity-index";
import { sortedByHours as sortedByModelYHours } from "@/data/modely-index";
import { cnyHour, localAmount } from "@/lib/format";

/**
 * 五大指数 tooltip 的唯一实现，落地页与探索页共用。
 * 榜单固定的指数直接导出组件；iPhone 双机型用工厂按当前榜单计算排名。
 */

export function BigMacPppTooltip({ active, payload }: RankTooltipProperties<BigMacPurchasingPower>) {
  const entry = payload?.[0]?.payload;
  if (!active || !entry) {
    return null;
  }
  const rank = sortedByBigMacPerHour.findIndex(item => item.countryCode === entry.countryCode) + 1;

  return (
    <TooltipShell
      country={entry.country}
      countryCode={entry.countryCode}
      rank={rank}
      region={entry.region}
      total={sortedByBigMacPerHour.length}
    >
      <p className="text-sm text-muted-foreground">
        最低时薪：
        {entry.localWageFormatted}
      </p>
      <p className="text-sm text-muted-foreground">
        巨无霸价格：
        {entry.localPriceFormatted}
      </p>
      <p className="text-sm font-medium text-primary">
        1小时 =
        {" "}
        {entry.bigMacPerHour}
        {" 个巨无霸"}
      </p>
    </TooltipShell>
  );
}

export function BigMacTooltip({ active, payload }: RankTooltipProperties<BigMacEntry>) {
  const entry = payload?.[0]?.payload;
  if (!active || !entry) {
    return null;
  }
  const rank = sortedByValuation.findIndex(item => item.countryCode === entry.countryCode) + 1;

  return (
    <TooltipShell
      country={entry.country}
      countryCode={entry.countryCode}
      note={entry.dataDate}
      rank={rank}
      region={entry.region}
      total={sortedByValuation.length}
    >
      <p className="text-sm text-muted-foreground">
        当地价格：
        {entry.localPriceFormatted}
      </p>
      <p className="text-sm font-medium text-primary">
        ≈ $
        {entry.usdPrice.toFixed(2)}
        {" USD"}
      </p>
      <p
        className="text-sm tabular-nums"
        style={{
          color: entry.valuationPct > 0
            ? "var(--color-stamp)"
            : (entry.valuationPct < 0 ? "var(--color-primary)" : "var(--color-muted-foreground)"),
        }}
      >
        {entry.valuationPct > 0 ? "高估 " : (entry.valuationPct < 0 ? "低估 " : "")}
        {entry.valuationPct > 0 ? "+" : ""}
        {entry.valuationPct}
        %
      </p>
    </TooltipShell>
  );
}

export function CommodityTooltip({ active, payload }: RankTooltipProperties<CommodityIndexEntry>) {
  const entry = payload?.[0]?.payload;
  if (!active || !entry) {
    return null;
  }
  const rank = sortedByHours.findIndex(item => item.countryCode === entry.countryCode) + 1;

  return (
    <TooltipShell
      country={entry.country}
      countryCode={entry.countryCode}
      note={`价格 ${COMMODITY_SOURCE.date}`}
      rank={entry.hoursToBuy === null ? undefined : rank}
      region={entry.region}
      total={sortedByHours.length}
    >
      <p className="text-sm text-muted-foreground">
        篮子总价 $
        {entry.basketUSD.toFixed(2)}
        {" / ¥"}
        {entry.basketCNY.toFixed(0)}
      </p>
      {entry.hoursToBuy === null
        ? <p className="text-sm text-muted-foreground">无最低工资数据</p>
        : (
            <p className="text-sm font-medium text-primary">
              需工作
              {" "}
              {entry.hoursToBuy}
              {" 小时"}
            </p>
          )}
    </TooltipShell>
  );
}

/**
 * 跨指数 tooltip：指标可切换，排名必须跟着当前榜单重算，故用工厂。
 */
// eslint-disable-next-line react-refresh/only-export-components -- 工厂返回 tooltip 组件，与同族 tooltip 共用一个模块
export function createHourlyPowerTooltip(metric: HourlyMetric, ranked: HourlyPowerEntry[]) {
  const withValue = ranked.filter(entry => metric.get(entry) !== null);

  return function HourlyPowerTooltip({ active, payload }: RankTooltipProperties<HourlyPowerEntry>) {
    const entry = payload?.[0]?.payload;
    if (!active || !entry) {
      return null;
    }
    const value = metric.get(entry);
    const rank = withValue.findIndex(item => item.countryCode === entry.countryCode) + 1;

    return (
      <TooltipShell
        country={entry.country}
        countryCode={entry.countryCode}
        note={entry.isProxy ? "代理值" : `${entry.effectiveDate} 生效`}
        rank={value === null ? undefined : rank}
        region={entry.region}
        total={withValue.length}
      >
        <p className="text-sm text-muted-foreground">
          最低时薪：
          {localAmount(entry.localWage, entry.localUnit)}
        </p>
        <p className="text-sm text-muted-foreground">
          ≈
          {" "}
          {cnyHour(entry.cnyHour)}
          /小时
        </p>
        <p className="text-sm font-medium text-primary">
          {metric.label}
          ：
          {metric.format(value)}
        </p>
      </TooltipShell>
    );
  };
}

/**
 * 按传入榜单计算排名——iPhone 有 Pro / Duo 两套数据，排名须跟随当前机型。
 *
 * @param ranked 当前机型已筛掉空值的榜单
 */
// eslint-disable-next-line react-refresh/only-export-components -- 工厂返回 tooltip 组件，与同族 tooltip 共用一个模块
export function createIPhoneTooltip(ranked: IPhoneIndexEntry[]) {
  const withHours = ranked.filter(item => item.hoursToBuy !== null);

  return function IPhoneTooltip({ active, payload }: RankTooltipProperties<IPhoneIndexEntry>) {
    const entry = payload?.[0]?.payload;
    if (!active || !entry) {
      return null;
    }
    const rank = withHours.findIndex(item => item.countryCode === entry.countryCode) + 1;

    return (
      <TooltipShell
        country={entry.country}
        countryCode={entry.countryCode}
        note={entry.taxNote}
        rank={entry.hoursToBuy === null ? undefined : rank}
        region={entry.region}
        total={withHours.length}
      >
        <p className="text-sm text-muted-foreground">
          iPhone ¥
          {entry.iphonePrice.toLocaleString()}
        </p>
        {entry.hoursToBuy === null
          ? <p className="text-sm text-muted-foreground">无最低工资数据</p>
          : (
              <p className="text-sm font-medium text-primary">
                需工作
                {" "}
                {entry.hoursToBuy}
                {" "}
                小时
              </p>
            )}
      </TooltipShell>
    );
  };
}

export function ModelYTooltip({ active, payload }: RankTooltipProperties<ModelYIndexEntry>) {
  const entry = payload?.[0]?.payload;
  if (!active || !entry) {
    return null;
  }
  const withHours = sortedByModelYHours.filter(item => item.hoursToBuy !== null);
  const rank = withHours.findIndex(item => item.countryCode === entry.countryCode) + 1;

  return (
    <TooltipShell
      country={entry.country}
      countryCode={entry.countryCode}
      note={entry.taxNote}
      rank={entry.hoursToBuy === null ? undefined : rank}
      region={entry.region}
      total={withHours.length}
    >
      <p className="text-sm text-muted-foreground">
        Model Y ¥
        {entry.modelyPrice.toLocaleString()}
      </p>
      {entry.hoursToBuy === null
        ? <p className="text-sm text-muted-foreground">无最低工资数据</p>
        : (
            <>
              <p className="text-sm font-medium text-primary">
                需工作
                {" "}
                {entry.hoursToBuy}
                {" 小时"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                按每天 8 小时折算约
                {" "}
                {entry.daysToBuy}
                {" 天"}
              </p>
            </>
          )}
    </TooltipShell>
  );
}
