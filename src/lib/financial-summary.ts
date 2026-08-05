import { isSameDay, isSameMonth, isSameWeek } from "date-fns";
import type { Expense, FinancialSummary, FixedExpense, Income, SavingsGoal } from "@/types";

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
  monthlySalary = 0,
  referenceDate = new Date(),
): FinancialSummary {
  const activeFixed = fixedExpenses.filter((f) => f.active);
  const totalFixed = activeFixed.reduce((sum, f) => sum + f.amount, 0);

  const expensesThisMonth = expenses.filter((e) => isSameMonth(new Date(e.date), referenceDate));
  const totalVariableThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.amount, 0);
  const spentThisMonth = totalFixed + totalVariableThisMonth;

  const incomeThisMonth = incomes.filter((i) => isSameMonth(new Date(i.date), referenceDate));
  const totalIncomeThisMonth = incomeThisMonth.reduce((sum, i) => sum + i.amount, 0);
  const salaryLoggedThisMonth = incomeThisMonth.some((i) => i.type === "salary");

  const spentToday = expenses
    .filter((e) => isSameDay(new Date(e.date), referenceDate))
    .reduce((sum, e) => sum + e.amount, 0);

  const spentThisWeek = expenses
    .filter((e) => isSameWeek(new Date(e.date), referenceDate, { weekStartsOn: 1 }))
    .reduce((sum, e) => sum + e.amount, 0);

  // Salary is a standing, recurring figure set once in Settings — like a
  // Fixed Expense — not a transaction re-logged every month. If a salary
  // transaction WAS logged this specific month (a raise takes effect, a
  // one-time correction, etc.), that real total wins over the assumption;
  // otherwise the configured salary carries forward on top of whatever
  // one-off income (freelance, bonus, etc.) was actually logged this month.
  const effectiveIncomeThisMonth = salaryLoggedThisMonth
    ? totalIncomeThisMonth
    : totalIncomeThisMonth + monthlySalary;

  // "Dinero disponible" (the hero figure) is a running balance — all income
  // you've ever logged minus all variable expenses you've ever logged minus
  // your current fixed obligations for this period. Deliberately NOT scoped
  // to "this month": a new user who logs a few expenses before their first
  // income entry would otherwise see a spuriously negative hero number on
  // day one, which reads as broken rather than as a real signal.
  const totalIncomeAllTime = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalVariableAllTime = expenses.reduce((sum, e) => sum + e.amount, 0);
  const availableBalance = totalIncomeAllTime - totalVariableAllTime - totalFixed;

  // "Disponible para el mes" stays scoped to the current month on purpose —
  // going negative there is a meaningful, intentional signal ("you're on
  // track to spend more than you've earned this month"), unlike the hero
  // figure above.
  const availableForMonth = effectiveIncomeThisMonth - spentThisMonth;
  // No explicit budget-setting feature yet, and no invented default either —
  // this app previously showed a hardcoded 3,000,000 COP "budget" the user
  // never set, which read as fabricated data. Zero here means "not enough
  // information yet" and every consumer (alerts, predictions, this card)
  // already guards on `monthlyBudget > 0` before using it.
  const monthlyBudget = effectiveIncomeThisMonth;

  const healthScore =
    monthlyBudget > 0
      ? Math.min(
          100,
          Math.max(0, Math.round(50 + ((monthlyBudget - spentThisMonth) / monthlyBudget) * 50)),
        )
      : 100;

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

  const salaryPortionThisMonth = salaryLoggedThisMonth
    ? incomeThisMonth.filter((i) => i.type === "salary").reduce((sum, i) => sum + i.amount, 0)
    : monthlySalary;

  return {
    availableBalance,
    monthlySalary: salaryPortionThisMonth,
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
