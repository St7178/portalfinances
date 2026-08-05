"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

const SLICE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

interface CategoryDonutProps {
  data: { category: string; amount: number }[];
}

export function CategoryDonut({ data }: CategoryDonutProps) {
  const { slices, total, config } = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.amount - a.amount);
    const top = sorted.slice(0, 4);
    const restTotal = sorted.slice(4).reduce((sum, d) => sum + d.amount, 0);
    const result = restTotal > 0 ? [...top, { category: "Otros", amount: restTotal }] : top;
    const totalAmount = result.reduce((sum, d) => sum + d.amount, 0);

    const chartConfig: ChartConfig = {};
    result.forEach((d, i) => {
      chartConfig[d.category] = { label: d.category, color: SLICE_COLORS[i % SLICE_COLORS.length] };
    });

    return { slices: result, total: totalAmount, config: chartConfig };
  }, [data]);

  return (
    <div className="relative">
      <ChartContainer config={config} className="mx-auto aspect-square max-h-64">
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
          />
          <Pie
            data={slices}
            dataKey="amount"
            nameKey="category"
            innerRadius="68%"
            outerRadius="100%"
            paddingAngle={2}
            stroke="var(--color-card)"
            strokeWidth={2}
          >
            {slices.map((entry, index) => (
              <Cell key={entry.category} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-muted-foreground">Total</span>
        <span className="text-lg font-semibold tabular-nums">{formatCurrency(total)}</span>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {slices.map((s, i) => (
          <div key={s.category} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length] }}
            />
            {s.category}
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>Gastos por categoría</caption>
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {slices.map((s) => (
            <tr key={s.category}>
              <td>{s.category}</td>
              <td>{formatCurrency(s.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
