import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listFixedExpenses } from "@/features/fixed-expenses/actions/list-fixed-expenses";
import { FixedExpensesManager } from "@/features/fixed-expenses/components/FixedExpensesManager";
import { listIncomes } from "@/features/income/actions/list-incomes";
import { getUserProfile } from "@/features/settings/actions/get-user-profile";
import { SettingsClientSections } from "@/features/settings/components/SettingsClientSections";
import { auth } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [fixedExpenses, profile, incomes] = userId
    ? await Promise.all([listFixedExpenses(userId), getUserProfile(userId), listIncomes(userId)])
    : [[], { notifyEmail: true, monthlySalary: 0 }, []];

  // A one-time nudge, not a sync: if no recurring salary is configured yet,
  // suggest the most recent salary-type income entry as a starting point
  // instead of making the user remember and retype it.
  const suggestedSalary =
    profile.monthlySalary === 0 ? (incomes.find((i) => i.type === "salary")?.amount ?? 0) : 0;

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gastos fijos</CardTitle>
          <CardDescription>
            Tus pagos recurrentes por quincena. La base para los recordatorios por correo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FixedExpensesManager initialData={fixedExpenses} />
        </CardContent>
      </Card>

      <SettingsClientSections
        initialNotifyEmail={profile.notifyEmail}
        initialMonthlySalary={profile.monthlySalary}
        suggestedSalary={suggestedSalary}
      />
    </div>
  );
}
