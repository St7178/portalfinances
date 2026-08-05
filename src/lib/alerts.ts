import { formatCurrency } from "@/lib/utils";
import type { AlertRule, FinancialSummary, FixedExpense, SavingsGoal } from "@/types";

function isLastDayOfMonth(date: Date): boolean {
  const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
  return next.getUTCDate() === 1;
}

export function computeAlerts(
  summary: FinancialSummary,
  activeFixedExpenses: FixedExpense[],
  savingsGoals: SavingsGoal[],
  referenceDate = new Date(),
): AlertRule[] {
  const alerts: AlertRule[] = [];

  if (summary.monthlyBudget > 0 && summary.spentThisMonth / summary.monthlyBudget >= 0.8) {
    const percent = Math.round((summary.spentThisMonth / summary.monthlyBudget) * 100);
    alerts.push({
      id: "budget_80",
      trigger: "budget_80",
      message: `Ya gastaste el ${percent}% del presupuesto mensual.`,
      severity: percent >= 100 ? "danger" : "warning",
      dismissible: true,
    });
  }

  const tomorrow = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate() + 1,
    ),
  );
  const dueTomorrow = activeFixedExpenses.filter((expense) =>
    expense.fortnight === "15" ? tomorrow.getUTCDate() === 15 : isLastDayOfMonth(tomorrow),
  );
  for (const expense of dueTomorrow) {
    alerts.push({
      id: `expense_due_tomorrow_${expense.id}`,
      trigger: "expense_due_tomorrow",
      message: `Mañana vence ${expense.name}.`,
      severity: "info",
      dismissible: true,
    });
  }

  const dayOfMonth = referenceDate.getUTCDate();
  if (dayOfMonth >= 5) {
    const daysInMonth = new Date(
      Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + 1, 0),
    ).getUTCDate();
    const projected = (summary.spentThisMonth / dayOfMonth) * daysInMonth;
    if (summary.monthlyBudget > 0 && projected > summary.monthlyBudget * 1.05) {
      alerts.push({
        id: "projection_high",
        trigger: "projection_high",
        message: `Si continúas así, terminarás gastando cerca de ${formatCurrency(projected)}.`,
        severity: "danger",
        dismissible: true,
      });
    }
  }

  for (const goal of savingsGoals) {
    if (goal.status !== "active" || goal.targetAmount <= 0) continue;
    const progress = goal.currentAmount / goal.targetAmount;
    if (progress >= 0.5) {
      alerts.push({
        id: `goal_milestone_${goal.id}`,
        trigger: "goal_milestone",
        message: `¡Llevas el ${Math.round(progress * 100)}% de tu meta ${goal.name}!`,
        severity: "info",
        dismissible: true,
      });
    }
  }

  return alerts;
}
