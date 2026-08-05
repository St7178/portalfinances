import { subDays } from "date-fns";
import type {
  AlertRule,
  CalendarEvent,
  Expense,
  FinancialSummary,
  FixedExpense,
  Income,
  SavingsGoal,
} from "@/types";

// Fixed anchor rather than `new Date()`: this file is imported by both
// Server and Client Components, and a live clock read at module scope
// evaluates once during SSR and again during client hydration. Those two
// reads can land on different calendar days when the server (UTC on
// Vercel) and the visitor's browser (their local timezone) disagree,
// producing a hydration mismatch on date-derived text. Mock data has no
// reason to track the real clock, so it doesn't.
//
// The noon anchor matters as much as the fixed value: `startOfMonth()` and
// the local-time `new Date(y, m, d)` constructor both land on local
// midnight, which is one negative UTC offset away from rolling onto the
// previous calendar day when a visitor's browser reformats it — that's a
// second, independent way to reproduce the same hydration bug even with a
// fixed anchor. `atNoonUTC` keeps every derived date a safe ~12h from that
// boundary regardless of the visitor's timezone.
const today = new Date("2026-08-04T12:00:00Z");
const atNoonUTC = (year: number, monthIndex: number, day: number) =>
  new Date(Date.UTC(year, monthIndex, day, 12));
const iso = (d: Date) => d.toISOString();

export const mockExpenses: Expense[] = [
  {
    id: "e1",
    name: "Supermercado",
    amount: 86.4,
    category: "Alimentación",
    date: iso(subDays(today, 0)),
    tags: ["mercado"],
    priority: "medium",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e2",
    name: "Uber",
    amount: 12.5,
    category: "Transporte",
    date: iso(subDays(today, 1)),
    tags: [],
    priority: "low",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e3",
    name: "Netflix",
    amount: 15.99,
    category: "Suscripciones",
    date: iso(subDays(today, 2)),
    tags: ["streaming"],
    priority: "low",
    type: "recurring",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e4",
    name: "Cine",
    amount: 24,
    category: "Entretenimiento",
    date: iso(subDays(today, 3)),
    tags: [],
    priority: "low",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e5",
    name: "Farmacia",
    amount: 38.2,
    category: "Salud",
    date: iso(subDays(today, 4)),
    tags: [],
    priority: "high",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e6",
    name: "Curso online",
    amount: 49,
    category: "Educación",
    date: iso(subDays(today, 6)),
    tags: [],
    priority: "medium",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e7",
    name: "Restaurante",
    amount: 42.75,
    category: "Alimentación",
    date: iso(subDays(today, 7)),
    tags: [],
    priority: "low",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e8",
    name: "Gasolina",
    amount: 55,
    category: "Transporte",
    date: iso(subDays(today, 9)),
    tags: [],
    priority: "medium",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e9",
    name: "Ropa",
    amount: 68,
    category: "Ropa",
    date: iso(subDays(today, 12)),
    tags: [],
    priority: "low",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
  {
    id: "e10",
    name: "Accesorios tech",
    amount: 120,
    category: "Tecnología",
    date: iso(subDays(today, 15)),
    tags: [],
    priority: "medium",
    type: "variable",
    createdAt: iso(today),
    updatedAt: iso(today),
  },
];

export const mockFixedExpenses: FixedExpense[] = [
  {
    id: "f1",
    name: "Moto",
    amount: 180,
    fortnight: "15",
    category: "Transporte",
    active: true,
    order: 0,
  },
  {
    id: "f2",
    name: "Transporte",
    amount: 60,
    fortnight: "15",
    category: "Transporte",
    active: true,
    order: 1,
  },
  {
    id: "f3",
    name: "Ahorro",
    amount: 200,
    fortnight: "15",
    category: "Ahorro",
    active: true,
    order: 2,
  },
  {
    id: "f4",
    name: "Internet",
    amount: 45,
    fortnight: "30",
    category: "Hogar",
    active: true,
    order: 0,
  },
  {
    id: "f5",
    name: "Celular",
    amount: 35,
    fortnight: "30",
    category: "Tecnología",
    active: true,
    order: 1,
  },
  {
    id: "f6",
    name: "Ahorro",
    amount: 200,
    fortnight: "30",
    category: "Ahorro",
    active: true,
    order: 2,
  },
];

export const mockIncomes: Income[] = [
  {
    id: "i1",
    name: "Salario",
    amount: 2600,
    type: "salary",
    date: iso(atNoonUTC(today.getUTCFullYear(), today.getUTCMonth(), 1)),
  },
  {
    id: "i2",
    name: "Proyecto freelance",
    amount: 420,
    type: "freelance",
    date: iso(subDays(today, 5)),
  },
];

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: "g1",
    name: "Moto nueva",
    targetAmount: 4500,
    currentAmount: 2650,
    targetDate: iso(atNoonUTC(today.getUTCFullYear(), today.getUTCMonth() + 4, 1)),
    color: "var(--color-chart-1)",
    emoji: "🏍️",
    status: "active",
  },
  {
    id: "g2",
    name: "Viaje a Japón",
    targetAmount: 3200,
    currentAmount: 980,
    targetDate: iso(atNoonUTC(today.getUTCFullYear() + 1, 2, 1)),
    color: "var(--color-chart-5)",
    emoji: "✈️",
    status: "active",
  },
  {
    id: "g3",
    name: "Fondo de emergencia",
    targetAmount: 2000,
    currentAmount: 2000,
    color: "var(--color-success)",
    emoji: "🛡️",
    status: "completed",
  },
];

export const mockAlerts: AlertRule[] = [
  {
    id: "a1",
    trigger: "budget_80",
    message: "Ya gastaste el 80% del presupuesto mensual.",
    severity: "warning",
    dismissible: true,
  },
  {
    id: "a2",
    trigger: "expense_due_tomorrow",
    message: "Mañana vence Internet.",
    severity: "info",
    dismissible: true,
  },
  {
    id: "a3",
    trigger: "goal_milestone",
    message: "¡Llevas el 59% de tu meta Moto nueva!",
    severity: "info",
    dismissible: true,
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  ...mockExpenses.map((e) => ({
    id: `cal-${e.id}`,
    date: e.date,
    kind: "expense" as const,
    label: e.name,
    amount: e.amount,
  })),
  {
    id: "cal-i1",
    date: mockIncomes[0]?.date ?? iso(today),
    kind: "income" as const,
    label: "Salario",
    amount: mockIncomes[0]?.amount ?? 0,
  },
  {
    id: "cal-f1",
    date: iso(atNoonUTC(today.getUTCFullYear(), today.getUTCMonth(), 15)),
    kind: "fixed" as const,
    label: "Moto + Transporte",
    amount: 240,
  },
  {
    id: "cal-f2",
    date: iso(atNoonUTC(today.getUTCFullYear(), today.getUTCMonth(), 30)),
    kind: "fixed" as const,
    label: "Internet + Celular",
    amount: 80,
  },
  {
    id: "cal-r1",
    date: iso(atNoonUTC(today.getUTCFullYear(), today.getUTCMonth(), 28)),
    kind: "reminder" as const,
    label: "Revisar presupuesto",
  },
];

const totalIncome = mockIncomes.reduce((sum, i) => sum + i.amount, 0);
const totalFixed = mockFixedExpenses.filter((f) => f.active).reduce((sum, f) => sum + f.amount, 0);
const totalVariable = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
const monthlyBudget = 2400;
const spentThisMonth = totalFixed + totalVariable;

export const mockSummary: FinancialSummary = {
  availableBalance: totalIncome - spentThisMonth,
  monthlySalary: mockIncomes.find((i) => i.type === "salary")?.amount ?? 0,
  spentToday: mockExpenses[0]?.amount ?? 0,
  spentThisWeek: mockExpenses.slice(0, 4).reduce((sum, e) => sum + e.amount, 0),
  spentThisMonth,
  availableForFortnight: (totalIncome - spentThisMonth) / 2,
  availableForMonth: totalIncome - spentThisMonth,
  totalSaved: mockSavingsGoals.reduce((sum, g) => sum + g.currentAmount, 0),
  monthlyBudget,
  healthScore: Math.min(
    100,
    Math.round(50 + ((monthlyBudget - spentThisMonth) / monthlyBudget) * 50),
  ),
  nextExpense: {
    name: "Internet",
    amount: 45,
    date: iso(atNoonUTC(today.getUTCFullYear(), today.getUTCMonth(), 30)),
  },
  nextIncome: {
    name: "Salario",
    amount: 2600,
    date: iso(atNoonUTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1)),
  },
};

export const mockCategoryBreakdown = Object.entries(
  mockExpenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {}),
).map(([category, amount]) => ({ category, amount }));

export const mockMonthlyTrend = [
  { month: "Mar", gastos: 1980, ingresos: 2600 },
  { month: "Abr", gastos: 2140, ingresos: 2600 },
  { month: "May", gastos: 1870, ingresos: 2900 },
  { month: "Jun", gastos: 2260, ingresos: 2600 },
  { month: "Jul", gastos: 2050, ingresos: 3020 },
  { month: "Ago", gastos: spentThisMonth, ingresos: totalIncome },
];
