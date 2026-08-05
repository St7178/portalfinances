import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import type { SpendingData } from "@/types";

/**
 * Turns the user's real Firestore data into a compact text block for the AI
 * system prompt. Shared by the one-shot analyzer and the chat endpoint so
 * both are grounded in the same real numbers instead of drifting apart.
 */
export function buildFinancialContext({ expenses, incomes, summary }: SpendingData): string {
  const recentExpenses = expenses
    .slice(0, 15)
    .map(
      (e) =>
        `- ${e.name} (${e.category}): ${formatCurrency(e.amount)} el ${format(new Date(e.date), "d MMM", { locale: es })}`,
    )
    .join("\n");

  const recentIncomes = incomes
    .slice(0, 5)
    .map(
      (i) =>
        `- ${i.name}: ${formatCurrency(i.amount)} el ${format(new Date(i.date), "d MMM", { locale: es })}`,
    )
    .join("\n");

  return `
Resumen financiero del usuario:
- Dinero disponible: ${formatCurrency(summary.availableBalance)}
- Gastado este mes: ${formatCurrency(summary.spentThisMonth)}
${summary.monthlyBudget > 0 ? `- Presupuesto mensual (ingresos de este mes): ${formatCurrency(summary.monthlyBudget)}\n` : ""}- Disponible para el mes: ${formatCurrency(summary.availableForMonth)}
- Total ahorrado: ${formatCurrency(summary.totalSaved)}
- Salud financiera: ${summary.healthScore}/100
${summary.nextExpense ? `- Próximo gasto fijo: ${summary.nextExpense.name} (${formatCurrency(summary.nextExpense.amount)})` : ""}

Gastos recientes (hasta 15):
${recentExpenses || "(sin gastos registrados)"}

Ingresos recientes (hasta 5):
${recentIncomes || "(sin ingresos registrados)"}
`.trim();
}
