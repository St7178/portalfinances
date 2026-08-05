import type { AlertRule } from "@/types";

export const AUTHORIZED_EMAILS = (process.env.AUTHORIZED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

export const LOCALE = process.env.NEXT_PUBLIC_LOCALE ?? "es-CO";
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "USD";

export const EXPENSE_CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Ropa",
  "Hogar",
  "Tecnología",
  "Suscripciones",
  "Otros",
] as const;

export const INCOME_TYPE_LABELS: Record<string, string> = {
  salary: "Salario",
  freelance: "Freelance",
  bonus: "Bonificación",
  rent: "Arriendo",
  dividends: "Dividendos",
  other: "Otros",
};

export const FORTNIGHT_LABELS: Record<string, string> = {
  "15": "Quincena 15",
  "30": "Quincena 30",
};

export const RECURRENCE_LABELS: Record<string, string> = {
  daily: "Diario",
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
  yearly: "Anual",
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export const ALERT_RULES: Omit<AlertRule, "id">[] = [
  {
    trigger: "budget_80",
    message: "Ya gastaste el 80% del presupuesto mensual.",
    severity: "warning",
    dismissible: true,
  },
  {
    trigger: "expense_due_tomorrow",
    message: "Mañana vence {expense_name}.",
    severity: "info",
    dismissible: true,
  },
  {
    trigger: "month_over_last",
    message: "Este mes llevas más gastado que el anterior.",
    severity: "warning",
    dismissible: true,
  },
  {
    trigger: "projection_high",
    message: "Si continúas así, terminarás gastando {projected}.",
    severity: "danger",
    dismissible: true,
  },
  {
    trigger: "goal_milestone",
    message: "¡Llevas el 50% de tu meta {goal_name}!",
    severity: "info",
    dismissible: true,
  },
];

export const KEYBOARD_SHORTCUTS = {
  commandPalette: "ctrl+k",
  quickAddExpense: "ctrl+e",
  quickAddIncome: "ctrl+i",
} as const;
