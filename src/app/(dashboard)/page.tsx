import { format, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowDownRight, ArrowUpRight, CalendarClock, PiggyBank, Wallet } from "lucide-react";
import { CategoryDonut } from "@/components/charts/CategoryDonut";
import { SpendingTrendChart } from "@/components/charts/SpendingTrendChart";
import { FinancialCard } from "@/components/shared/FinancialCard";
import { HealthIndicator } from "@/components/shared/HealthIndicator";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { RecentTransactions } from "@/components/shared/RecentTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBanner } from "@/features/alerts/components/AlertBanner";
import { listExpenses } from "@/features/expenses/actions/list-expenses";
import { listFixedExpenses } from "@/features/fixed-expenses/actions/list-fixed-expenses";
import { listIncomes } from "@/features/income/actions/list-incomes";
import { listSavingsGoals } from "@/features/savings/actions/list-savings-goals";
import { SavingsGoalCard } from "@/features/savings/components/SavingsGoalCard";
import { computeAlerts } from "@/lib/alerts";
import { computeCategoryBreakdown, computeMonthlyTrend } from "@/lib/analytics";
import { auth } from "@/lib/auth/config";
import { computeFinancialSummary } from "@/lib/financial-summary";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import {
  mockAlerts,
  mockCategoryBreakdown,
  mockExpenses,
  mockIncomes,
  mockMonthlyTrend,
  mockSavingsGoals,
  mockSummary,
} from "@/lib/mock/data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const useMockData = DEMO_MODE || !userId;

  const [expenses, incomes, savingsGoals, fixedExpenses] = useMockData
    ? [mockExpenses, mockIncomes, mockSavingsGoals, []]
    : await Promise.all([
        listExpenses(userId),
        listIncomes(userId),
        listSavingsGoals(userId),
        listFixedExpenses(userId),
      ]);

  const s = useMockData
    ? mockSummary
    : computeFinancialSummary(expenses, incomes, fixedExpenses, savingsGoals);

  const alerts = useMockData
    ? mockAlerts
    : computeAlerts(
        s,
        fixedExpenses.filter((f) => f.active),
        savingsGoals,
      );

  const categoryBreakdown = useMockData
    ? mockCategoryBreakdown
    : computeCategoryBreakdown(expenses.filter((e) => isSameMonth(new Date(e.date), new Date())));

  const monthlyTrend = useMockData ? mockMonthlyTrend : computeMonthlyTrend(expenses, incomes);

  return (
    <div className="space-y-6">
      <AlertBanner alerts={alerts} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-primary/70 p-6 text-primary-foreground shadow-lg shadow-primary/20 lg:col-span-2">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
          />
          <p className="text-sm font-medium text-primary-foreground/80">Dinero disponible</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
            {formatCurrency(s.availableBalance)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-primary-foreground/70">Salario</p>
              <p className="font-mono text-sm font-medium tabular-nums">
                {formatCurrency(s.monthlySalary)}
              </p>
            </div>
            <div>
              <p className="text-xs text-primary-foreground/70">Gastado hoy</p>
              <p className="font-mono text-sm font-medium tabular-nums">
                {formatCurrency(s.spentToday)}
              </p>
            </div>
            <div>
              <p className="text-xs text-primary-foreground/70">Para la quincena</p>
              <p className="font-mono text-sm font-medium tabular-nums">
                {formatCurrency(s.availableForFortnight)}
              </p>
            </div>
            <div>
              <p className="text-xs text-primary-foreground/70">Total ahorrado</p>
              <p className="font-mono text-sm font-medium tabular-nums">
                {formatCurrency(s.totalSaved)}
              </p>
            </div>
          </div>
        </div>

        <Card className="justify-center">
          <CardContent className="flex h-full flex-col justify-center gap-4">
            <HealthIndicator score={s.healthScore} />
            <div className="space-y-1 border-t border-border pt-3 text-xs">
              {s.nextExpense && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <ArrowDownRight className="size-3.5 text-danger" /> Próximo gasto
                  </span>
                  <span className="font-medium">
                    {s.nextExpense.name} · {formatCurrency(s.nextExpense.amount)}
                  </span>
                </div>
              )}
              {s.nextIncome && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <ArrowUpRight className="size-3.5 text-success" /> Próximo pago
                  </span>
                  <span className="font-medium">
                    {format(new Date(s.nextIncome.date), "d MMM", { locale: es })}
                  </span>
                </div>
              )}
              {!s.nextExpense && !s.nextIncome && (
                <p className="text-center text-muted-foreground">
                  Agrega gastos fijos para ver tus próximos pagos aquí.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <FinancialCard
          label="Gastado esta semana"
          value={formatCurrency(s.spentThisWeek)}
          icon={<Wallet />}
          delay={0.05}
        />
        <FinancialCard
          label="Gastado este mes"
          value={formatCurrency(s.spentThisMonth)}
          icon={<CalendarClock />}
          delay={0.1}
        />
        <FinancialCard
          label="Disponible para el mes"
          value={formatCurrency(s.availableForMonth)}
          icon={<ArrowUpRight />}
          delay={0.15}
        />
        <FinancialCard
          label="Total ahorrado"
          value={formatCurrency(s.totalSaved)}
          icon={<PiggyBank />}
          delay={0.2}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Presupuesto mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(s.spentThisMonth)} de {formatCurrency(s.monthlyBudget)}
            </span>
            <span className="font-medium tabular-nums">
              {s.monthlyBudget > 0 ? Math.round((s.spentThisMonth / s.monthlyBudget) * 100) : 0}%
            </span>
          </div>
          <ProgressBar value={s.spentThisMonth} max={s.monthlyBudget} className="mt-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Gastos por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Sin gastos este mes todavía.
              </p>
            ) : (
              <CategoryDonut data={categoryBreakdown} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tendencia mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingTrendChart data={monthlyTrend} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Últimos movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions expenses={expenses} incomes={incomes} />
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <h2 className="px-1 text-sm font-medium text-muted-foreground">Objetivos de ahorro</h2>
          {savingsGoals.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Aún no tienes metas de ahorro.
              </CardContent>
            </Card>
          ) : (
            savingsGoals.map((goal, i) => (
              <SavingsGoalCard key={goal.id} goal={goal} delay={i * 0.05} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
