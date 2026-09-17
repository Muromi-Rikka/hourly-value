import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { BigMacPurchasingPower } from "@/data/bigmac-ppp";
import { BigMacPppTooltip } from "@/components/bigmac-ppp-tooltip";

interface BigMacPppChartProperties {
  data: BigMacPurchasingPower[];
  highlight?: null | string;
  layout?: "horizontal" | "vertical";
}

export function BigMacPppChart({ data, highlight, layout = "vertical" }: BigMacPppChartProperties) {
  const sorted = data.toSorted((a, b) => a.bigMacPerHour - b.bigMacPerHour);

  if (layout === "horizontal") {
    return (
      <div>
        <ResponsiveContainer height={Math.max(300, data.length * 40)} width="100%">
          <BarChart data={sorted} layout="vertical" margin={{ bottom: 8, left: 8, right: 40, top: 8 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              axisLine={false}
              tickFormatter={(v: number) => `${v}个`}
              tickLine={false}
              type="number"
            />
            <YAxis
              axisLine={false}
              dataKey="country"
              tickLine={false}
              type="category"
              width={80}
            />
            <Tooltip content={<BigMacPppTooltip />} cursor={false} />
            <Bar
              animationBegin={200}
              animationDuration={800}
              dataKey="bigMacPerHour"
              maxBarSize={28}
              radius={[0, 4, 4, 0]}
            >
              {sorted.map(entry => (
                <Cell
                  fill={`var(--color-region-${regionKey(entry.region)})`}
                  key={entry.countryCode}
                  opacity={highlight && highlight !== entry.countryCode ? 0.3 : 1}
                />
              ))}
              <LabelList content={<ValueLabel />} dataKey="bigMacPerHour" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <CustomLegend />
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer height={400} width="100%">
        <BarChart data={sorted} margin={{ bottom: 40, left: 8, right: 8, top: 24 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            angle={-45}
            axisLine={false}
            dataKey="country"
            height={60}
            textAnchor="end"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tickFormatter={(v: number) => `${v}个`}
            tickLine={false}
          />
          <Tooltip content={<BigMacPppTooltip />} cursor={false} />
          <Bar
            animationBegin={200}
            animationDuration={800}
            dataKey="bigMacPerHour"
            maxBarSize={48}
            radius={[4, 4, 0, 0]}
          >
            {sorted.map(entry => (
              <Cell
                fill={`var(--color-region-${regionKey(entry.region)})`}
                key={entry.countryCode}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
}

function CustomLegend() {
  const items = [
    { color: "var(--color-region-asia)", label: "亚洲" },
    { color: "var(--color-region-europe)", label: "欧洲" },
    { color: "var(--color-region-oceania)", label: "大洋洲" },
    { color: "var(--color-region-north-america)", label: "北美" },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-2">
      {items.map(item => (
        <div className="flex items-center gap-1.5" key={item.label}>
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: item.color }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function regionKey(region: string): string {
  if (region === "北美") {
    return "north-america";
  }
  if (region === "亚洲") {
    return "asia";
  }
  if (region === "欧洲") {
    return "europe";
  }
  return "oceania";
}

function ValueLabel(properties: Record<string, unknown>) {
  const { value, width, x, y } = properties as Record<string, unknown>;
  if (typeof value !== "number" || typeof width !== "number" || typeof x !== "number" || typeof y !== "number") {
    return null;
  }
  return (
    <text
      className="fill-muted-foreground text-xs tabular-nums"
      x={x + width + 6}
      y={y + 14}
    >
      {value}
      个
    </text>
  );
}
