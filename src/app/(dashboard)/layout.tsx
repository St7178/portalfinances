import { CommandPalette } from "@/components/layout/CommandPalette";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { listExpenses } from "@/features/expenses/actions/list-expenses";
import { QuickAddModal } from "@/features/expenses/components/QuickAddModal";
import { listFixedExpenses } from "@/features/fixed-expenses/actions/list-fixed-expenses";
import { listIncomes } from "@/features/income/actions/list-incomes";
import { listSavingsGoals } from "@/features/savings/actions/list-savings-goals";
import { getUserProfile } from "@/features/settings/actions/get-user-profile";
import { computeAlerts } from "@/lib/alerts";
import { auth } from "@/lib/auth/config";
import { computeFinancialSummary } from "@/lib/financial-summary";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import { mockAlerts } from "@/lib/mock/data";

const DEMO_USER = {
  name: "Steven",
  email: "modo-demo@finanzas.app",
  image: null,
};

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  const userId = session?.user?.id;
  const useMockData = DEMO_MODE || !userId;

  const user = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : process.env.AUTH_GOOGLE_ID
      ? null
      : DEMO_USER;

  const alerts = useMockData
    ? mockAlerts
    : await (async () => {
        const [expenses, incomes, fixedExpenses, savingsGoals, profile] = await Promise.all([
          listExpenses(userId),
          listIncomes(userId),
          listFixedExpenses(userId),
          listSavingsGoals(userId),
          getUserProfile(userId),
        ]);
        const summary = computeFinancialSummary(
          expenses,
          incomes,
          fixedExpenses,
          savingsGoals,
          profile.monthlySalary,
        );
        return computeAlerts(
          summary,
          fixedExpenses.filter((f) => f.active),
          savingsGoals,
        );
      })();

  return (
    <div className="flex min-h-dvh w-full">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} alerts={alerts} />
        <main className="flex-1 px-4 pb-16 pt-4 md:px-8 md:pb-10 md:pt-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      <CommandPalette />
      <QuickAddModal />
    </div>
  );
}
