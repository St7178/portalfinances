import { getDay, isSameMonth, subMonths } from "date-fns";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { Expense } from "@/types";

const WEEKDAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export interface Insight {
  text: string;
  tone: "positive" | "warning" | "neutral";
}

export function computeInsights(expenses: Expense[], referenceDate = new Date()): Insight[] {
  const insights: Insight[] = [];

  const thisMonth = expenses.filter((e) => isSameMonth(new Date(e.date), referenceDate));
  const lastMonthDate = subMonths(referenceDate, 1);
  const lastMonth = expenses.filter((e) => isSameMonth(new Date(e.date), lastMonthDate));

  if (thisMonth.length === 0) {
    return [
      { text: "Agrega algunos gastos este mes para empezar a ver insights.", tone: "neutral" },
    ];
  }

  const byCategory = thisMonth.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    const [category, amount] = topCategory;
    insights.push({
      text: `Tu categoría con más gasto este mes es ${category}, con ${formatCurrency(amount)}.`,
      tone: "neutral",
    });
  }

  const totalThisMonth = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const totalLastMonth = lastMonth.reduce((sum, e) => sum + e.amount, 0);
  if (totalLastMonth > 0) {
    const change = (totalThisMonth - totalLastMonth) / totalLastMonth;
    insights.push({
      text:
        change >= 0
          ? `Llevas ${formatPercent(change)} más gastado que el mes pasado en este punto.`
          : `Llevas ${formatPercent(Math.abs(change))} menos gastado que el mes pasado en este punto.`,
      tone: change > 0.1 ? "warning" : "positive",
    });
  }

  const byWeekday = thisMonth.reduce<Record<number, number>>((acc, e) => {
    const day = getDay(new Date(e.date));
    acc[day] = (acc[day] ?? 0) + e.amount;
    return acc;
  }, {});
  const topWeekday = Object.entries(byWeekday).sort((a, b) => b[1] - a[1])[0];
  if (topWeekday) {
    const [dayIndex, amount] = topWeekday;
    insights.push({
      text: `Los ${WEEKDAY_NAMES[Number(dayIndex)]} son tu día de más gasto este mes, con ${formatCurrency(amount)} en total.`,
      tone: "neutral",
    });
  }

  const topExpense = [...thisMonth].sort((a, b) => b.amount - a.amount)[0];
  if (topExpense) {
    insights.push({
      text: `Tu gasto más grande del mes fue "${topExpense.name}" por ${formatCurrency(topExpense.amount)}.`,
      tone: "neutral",
    });
  }

  const highPriorityCount = thisMonth.filter((e) => e.priority === "high").length;
  if (highPriorityCount > 0) {
    insights.push({
      text: `Tienes ${highPriorityCount} ${highPriorityCount === 1 ? "gasto marcado" : "gastos marcados"} como prioridad alta este mes.`,
      tone: "warning",
    });
  }

  return insights;
}
