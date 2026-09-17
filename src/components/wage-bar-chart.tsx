import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WageEntry } from "@/data/wages";
import { WageTooltip } from "@/components/wage-tooltip";

interface WageBarChartProperties {
  data: WageEntry[];
  highlight?: null | string;
  layout?: "horizontal" | "vertical";
}

export function WageBarChart({ data, highlight, layout = "vertical" }: WageBarChartProperties) {
  const sorted = data.toSorted((a, b) => a.cnyEquivalent - b.cnyEquivalent);

  if (layout === "horizontal") {
    return (
      <ResponsiveContainer height={Math.max(300, data.length * 40)} width="100%">
        <BarChart data={sorted} layout="vertical" margin={{ bottom: 8, left: 8, right: 24, top: 8 }}>
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis
            axisLine={false}
            tickFormatter={(v: number) => `¥${v}`}
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
          <Tooltip content={<WageTooltip />} cursor={false} />
          <Bar dataKey="cnyEquivalent" maxBarSize={28} radius={[0, 4, 4, 0]}>
            {sorted.map(entry => (
              <Cell
                fill="var(--color-primary)"
                key={entry.countryCode}
                opacity={highlight && highlight !== entry.countryCode ? 0.35 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
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
          tickFormatter={(v: number) => `¥${v}`}
          tickLine={false}
        />
        <Tooltip content={<WageTooltip />} cursor={false} />
        <Bar dataKey="cnyEquivalent" fill="var(--color-primary)" maxBarSize={48} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
