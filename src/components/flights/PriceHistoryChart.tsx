import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMonthCompact } from "@/lib/dates";

import { useCurrency } from "@/lib/currency-context";
import type { MonthlyPrice } from "@/lib/flights.types";

function monthLabel(month: string): string {
  const d = new Date(`${month}-01T00:00:00Z`);
  return formatMonthCompact(month);
}

export function PriceHistoryChart({ months }: { months: MonthlyPrice[] }) {
  const { format } = useCurrency();
  const data = months.map((m) => ({ ...m, label: monthLabel(m.month) }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="var(--color-muted-foreground)"
            width={56}
            tickFormatter={(value: number) => format(value)}
          />
          <Tooltip
            formatter={(value: number) => [format(value), "Prix le plus bas"]}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-border)",
              background: "var(--color-card)",
              fontSize: 13,
            }}
          />
          <Area
            type="monotone"
            dataKey="priceEur"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#priceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
