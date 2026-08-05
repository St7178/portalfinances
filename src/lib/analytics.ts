import { endOfMonth, format, isSameMonth, subMonths } from "date-fns";
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

  return months.map((month) => {
    const incomeLoggedThatMonth = incomes.filter((i) => isSameMonth(new Date(i.date), month));
    const salaryLoggedThatMonth = incomeLoggedThatMonth.some((i) => i.type === "salary");

    // Same "salary is recurring, not a monthly transaction" treatment as
    // computeFinancialSummary — otherwise this trend line would show real
    // income only in the one month it was logged and $0 every month after,
    // which is exactly the "looks broken" complaint this fixes elsewhere.
    const lastKnownSalaryAsOfMonth = salaryLoggedThatMonth
      ? undefined
      : incomes
          .filter((i) => i.type === "salary" && new Date(i.date) <= endOfMonth(month))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.amount;

    return {
      month: format(month, "MMM", { locale: es }),
      gastos: expenses
        .filter((e) => isSameMonth(new Date(e.date), month))
        .reduce((sum, e) => sum + e.amount, 0),
      ingresos:
        incomeLoggedThatMonth.reduce((sum, i) => sum + i.amount, 0) +
        (lastKnownSalaryAsOfMonth ?? 0),
    };
  });
}
