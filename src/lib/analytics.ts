import { format, isSameMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import type { Expense, Income } from "@/types";

export function computeCategoryBreakdown(expenses: Expense[]) {
  const totals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  return Object.entries(totals).map(([category, amount]) => ({ category, amount }));
}

export function computeMonthlyTrend(
  expenses: Expense[],
  incomes: Income[],
  monthsBack = 6,
  referenceDate = new Date(),
) {
  const months = Array.from({ length: monthsBack }, (_, i) =>
    subMonths(referenceDate, monthsBack - 1 - i),
  );

  return months.map((month) => ({
    month: format(month, "MMM", { locale: es }),
    gastos: expenses
      .filter((e) => isSameMonth(new Date(e.date), month))
      .reduce((sum, e) => sum + e.amount, 0),
    ingresos: incomes
      .filter((i) => isSameMonth(new Date(i.date), month))
      .reduce((sum, i) => sum + i.amount, 0),
  }));
}
