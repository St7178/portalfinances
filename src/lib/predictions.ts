import { formatCurrency } from "@/lib/utils";
import type { FinancialSummary, SavingsGoal } from "@/types";

export interface Prediction {
  label: string;
  value: string;
  tone: "positive" | "warning" | "danger" | "neutral";
  detail?: string;
}

export function computePredictions(
  summary: FinancialSummary,
  savingsGoals: SavingsGoal[],
  referenceDate = new Date(),
): Prediction[] {
  const predictions: Prediction[] = [];

  const dayOfMonth = referenceDate.getDate();
  const daysInMonth = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    0,
  ).getDate();
  const projected = dayOfMonth > 0 ? (summary.spentThisMonth / dayOfMonth) * daysInMonth : 0;
  const overBudget = summary.monthlyBudget > 0 && projected > summary.monthlyBudget;

  predictions.push({
    label: "Proyección de gasto al cierre del mes",
    value: formatCurrency(projected),
    tone: overBudget ? "danger" : "positive",
    detail: overBudget
      ? `Superarías tu presupuesto por ${formatCurrency(projected - summary.monthlyBudget)}.`
      : summary.monthlyBudget > 0
        ? `Quedarías ${formatCurrency(summary.monthlyBudget - projected)} por debajo de tu presupuesto.`
        : undefined,
  });

  const expectedPace = summary.monthlyBudget > 0 ? (dayOfMonth / daysInMonth) * 100 : 0;
  const actualPace =
    summary.monthlyBudget > 0 ? (summary.spentThisMonth / summary.monthlyBudget) * 100 : 0;
  if (summary.monthlyBudget > 0) {
    const ahead = actualPace > expectedPace;
    predictions.push({
      label: "Ritmo de gasto",
      value: `${Math.round(actualPace)}% del presupuesto usado`,
      tone: ahead ? "warning" : "positive",
      detail: ahead
        ? `Vas más rápido de lo esperado — hoy deberías llevar cerca de ${Math.round(expectedPace)}%.`
        : `Vas dentro de lo esperado para el día ${dayOfMonth} del mes.`,
    });
  }

  if (summary.nextExpense) {
    predictions.push({
      label: "Próximo gasto fijo",
      value: `${summary.nextExpense.name} · ${formatCurrency(summary.nextExpense.amount)}`,
      tone: "neutral",
    });
  }

  for (const goal of savingsGoals) {
    if (goal.status !== "active" || goal.targetAmount <= 0) continue;
    const remaining = goal.targetAmount - goal.currentAmount;
    const progress = goal.currentAmount / goal.targetAmount;
    predictions.push({
      label: `Meta: ${goal.name}`,
      value: `Faltan ${formatCurrency(remaining)}`,
      tone: progress >= 0.75 ? "positive" : "neutral",
      detail: `Llevas el ${Math.round(progress * 100)}%.`,
    });
  }

  return predictions;
}
