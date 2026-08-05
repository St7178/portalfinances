export type Fortnight = "15" | "30";

export type ExpensePriority = "low" | "medium" | "high";

export type ExpenseType = "variable" | "fixed" | "recurring";

export type RecurrenceFrequency = "daily" | "weekly" | "biweekly" | "monthly" | "yearly";

export type IncomeType = "salary" | "freelance" | "bonus" | "rent" | "dividends" | "other";

export type SavingsGoalStatus = "active" | "completed" | "paused";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  tags: string[];
  priority: ExpensePriority;
  type: ExpenseType;
  createdAt: string;
  updatedAt: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  fortnight: Fortnight;
  category: string;
  active: boolean;
  order: number;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: RecurrenceFrequency;
  startDate: string;
  skipWeekends: boolean;
  active: boolean;
}

export interface Income {
  id: string;
  name: string;
  amount: number;
  type: IncomeType;
  date: string;
  description?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  color: string;
  emoji?: string;
  status: SavingsGoalStatus;
}

export interface CalendarEvent {
  id: string;
  date: string;
  kind: "expense" | "income" | "fixed" | "reminder";
  label: string;
  amount?: number;
}

export interface AlertRule {
  id: string;
  trigger:
    | "budget_80"
    | "expense_due_tomorrow"
    | "month_over_last"
    | "projection_high"
    | "goal_milestone";
  message: string;
  severity: "info" | "warning" | "danger";
  dismissible: boolean;
}

export interface FinancialSummary {
  availableBalance: number;
  monthlySalary: number;
  spentToday: number;
  spentThisWeek: number;
  spentThisMonth: number;
  availableForFortnight: number;
  availableForMonth: number;
  totalSaved: number;
  monthlyBudget: number;
  healthScore: number;
  nextExpense?: { name: string; amount: number; date: string };
  nextIncome?: { name: string; amount: number; date: string };
}

export interface SpendingData {
  expenses: Expense[];
  incomes: Income[];
  summary: FinancialSummary;
}
