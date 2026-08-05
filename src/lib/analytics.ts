import { format, isSameMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import type { Expense, FixedExpense, Income } from "@/types";

export function computeCategoryBreakdown(expenses: Expense[]) {
  const totals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  return Object.entries(totals).map(([category, amount]) => ({ category, amount }));
}

export interface MonthlyHistoryEntry {
  month: string;
  gastos: number;
  ingresos: number;
  ahorroNeto: number;
}

export function computeMonthlyTrend(
  expenses: Expense[],
  incomes: Income[],
  fixedExpenses: FixedExpense[],
  monthlySalary: number,
  monthsBack = 6,
  referenceDate = new Date(),
): MonthlyHistoryEntry[] {
  // Fixed expenses have no historical snapshot (we only know today's active
  // list), so every past month is approximated with today's active total —
  // the same simplification the rest of the app makes by not tracking when
  // a fixed expense was added, changed, or paused.
  const totalFixed = fixedExpenses.filter((f) => f.active).reduce((sum, f) => sum + f.amount, 0);

  const months = Array.from({ length: monthsBack }, (_, i) =>
    subMonths(referenceDate, monthsBack - 1 - i),
  );

  return months.map((month) => {
    const incomeLoggedThatMonth = incomes.filter((i) => isSameMonth(new Date(i.date), month));
    const salaryLoggedThatMonth = incomeLoggedThatMonth.some((i) => i.type === "salary");

    // Same "salary is recurring, not a monthly transaction" treatment as
    // computeFinancialSummary — otherwise this trend would show real income
    // only in the one month it was logged and $0 every month around it.
    const ingresos =
      incomeLoggedThatMonth.reduce((sum, i) => sum + i.amount, 0) +
      (salaryLoggedThatMonth ? 0 : monthlySalary);

    const gastos =
      totalFixed +
      expenses
        .filter((e) => isSameMonth(new Date(e.date), month))
        .reduce((sum, e) => sum + e.amount, 0);

    return {
      month: format(month, "MMM", { locale: es }),
      gastos,
      ingresos,
      ahorroNeto: ingresos - gastos,
    };
  });
}
