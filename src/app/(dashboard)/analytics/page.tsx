import { format, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { TrendingUp } from "lucide-react";
import { CategoryDonut } from "@/components/charts/CategoryDonut";
import { SpendingTrendChart } from "@/components/charts/SpendingTrendChart";
import { WeekdaySpendChart } from "@/components/charts/WeekdaySpendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCategoryBreakdown, mockExpenses, mockMonthlyTrend } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/utils";

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday-first
const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function AnalyticsPage() {
  const totalSpent = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgDaily = totalSpent / 30;
  const topExpenses = [...mockExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5);

  const byWeekday = WEEKDAY_ORDER.map((dayIndex, i) => ({
    day: WEEKDAY_LABELS[i] as string,
    amount: mockExpenses
      .filter((e) => getDay(new Date(e.date)) === dayIndex)
      .reduce((sum, e) => sum + e.amount, 0),
  }));

  const today = new Date();
  const dayOfMonth = today.getDate();
  const projection = (totalSpent / dayOfMonth) * 30;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Promedio diario</p>
            <p className="text-xl font-semibold tabular-nums">{formatCurrency(avgDaily)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">Total del mes</p>
            <p className="text-xl font-semibold tabular-nums">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3.5" /> Proyección fin de mes
            </p>
            <p className="text-xl font-semibold tabular-nums">{formatCurrency(projection)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Gastos por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryDonut data={mockCategoryBreakdown} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Días con más gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <WeekdaySpendChart data={byWeekday} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Comparación mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingTrendChart data={mockMonthlyTrend} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top 5 gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="divide-y divide-border">
            {topExpenses.map((expense, i) => (
              <li key={expense.id} className="flex items-center gap-3 py-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{expense.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {expense.category} · {format(new Date(expense.date), "d MMM", { locale: es })}
                  </p>
                </div>
                <span className="font-mono text-sm font-medium tabular-nums">
                  {formatCurrency(expense.amount)}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
