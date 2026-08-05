import { isSameDay, isSameMonth, isSameWeek } from "date-fns";
import type { Expense, FinancialSummary, FixedExpense, Income, SavingsGoal } from "@/types";

/** No explicit budget-setting feature yet — used only when there's no income recorded this month to derive one from. */
const DEFAULT_MONTHLY_BUDGET = 3_000_000;

const atNoonUTC = (year: number, monthIndex: number, day: number) =>
  new Date(Date.UTC(year, monthIndex, day, 12));

function fortnightDueDate(fortnight: FixedExpense["fortnight"], year: number, monthIndex: number) {
  if (fortnight === "15") return atNoonUTC(year, monthIndex, 15);
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  return atNoonUTC(year, monthIndex, lastDay);
}

function getNextFixedExpenseDue(activeFixed: FixedExpense[], referenceDate: Date) {
  if (activeFixed.length === 0) return undefined;

  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();

  let best: { expense: FixedExpense; date: Date } | undefined;

  const periods: Array<[number, number]> = [
    [year, month],
    [year, month + 1],
  ];

  for (const expense of activeFixed) {
    for (const [y, m] of periods) {
      const due = fortnightDueDate(expense.fortnight, y, m);
      if (due < referenceDate) continue;
      if (!best || due < best.date) best = { expense, date: due };
    }
  }

  if (!best) return undefined;
  return { name: best.expense.name, amount: best.expense.amount, date: best.date.toISOString() };
}

export function computeFinancialSummary(
  expenses: Expense[],
  incomes: Income[],
  fixedExpenses: FixedExpense[],
  savingsGoals: SavingsGoal[],
  referenceDate = new Date(),
): FinancialSummary {
  const activeFixed = fixedExpenses.filter((f) => f.active);
  const totalFixed = activeFixed.reduce((sum, f) => sum + f.amount, 0);

  const expensesThisMonth = expenses.filter((e) => isSameMonth(new Date(e.date), referenceDate));
  const totalVariableThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.amount, 0);
  const spentThisMonth = totalFixed + totalVariableThisMonth;

  const incomeThisMonth = incomes.filter((i) => isSameMonth(new Date(i.date), referenceDate));
  const totalIncomeThisMonth = incomeThisMonth.reduce((sum, i) => sum + i.amount, 0);

  const spentToday = expenses
    .filter((e) => isSameDay(new Date(e.date), referenceDate))
    .reduce((sum, e) => sum + e.amount, 0);

  const spentThisWeek = expenses
    .filter((e) => isSameWeek(new Date(e.date), referenceDate, { weekStartsOn: 1 }))
    .reduce((sum, e) => sum + e.amount, 0);

  const currentSalary =
    incomes.find((i) => i.type === "salary" && isSameMonth(new Date(i.date), referenceDate))
      ?.amount ??
    incomes.find((i) => i.type === "salary")?.amount ??
    0;

  const availableForMonth = totalIncomeThisMonth - spentThisMonth;
  const monthlyBudget = totalIncomeThisMonth > 0 ? totalIncomeThisMonth : DEFAULT_MONTHLY_BUDGET;

  const healthScore = Math.min(
    100,
    Math.max(0, Math.round(50 + ((monthlyBudget - spentThisMonth) / monthlyBudget) * 50)),
  );

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  return {
    availableBalance: availableForMonth,
    monthlySalary: currentSalary,
    spentToday,
    spentThisWeek,
    spentThisMonth,
    availableForFortnight: availableForMonth / 2,
    availableForMonth,
    totalSaved,
    monthlyBudget,
    healthScore,
    nextExpense: getNextFixedExpenseDue(activeFixed, referenceDate),
  };
}
