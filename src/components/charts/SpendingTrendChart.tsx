"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

const chartConfig = {
  ingresos: { label: "Ingresos", color: "var(--color-success)" },
  gastos: { label: "Gastos", color: "var(--color-danger)" },
} satisfies ChartConfig;

interface SpendingTrendChartProps {
  data: { month: string; gastos: number; ingresos: number }[];
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  return (
    <div>
      <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
        <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="fillIngresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.28} />
              <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillGastos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.24} />
              <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <span className="flex w-full items-center justify-between gap-3">
                    <span className="text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label}
                    </span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {formatCurrency(Number(value))}
                    </span>
                  </span>
                )}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="ingresos"
            stroke="var(--color-success)"
            strokeWidth={2}
            fill="url(#fillIngresos)"
          />
          <Area
            type="monotone"
            dataKey="gastos"
            stroke="var(--color-danger)"
            strokeWidth={2}
            fill="url(#fillGastos)"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>

      <table className="sr-only">
        <caption>Ingresos y gastos mensuales</caption>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Ingresos</th>
            <th>Gastos</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <td>{d.month}</td>
              <td>{formatCurrency(d.ingresos)}</td>
              <td>{formatCurrency(d.gastos)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
