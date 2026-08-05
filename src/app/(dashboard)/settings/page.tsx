import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listFixedExpenses } from "@/features/fixed-expenses/actions/list-fixed-expenses";
import { FixedExpensesManager } from "@/features/fixed-expenses/components/FixedExpensesManager";
import { getUserProfile } from "@/features/settings/actions/get-user-profile";
import { SettingsClientSections } from "@/features/settings/components/SettingsClientSections";
import { auth } from "@/lib/auth/config";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [fixedExpenses, profile] = userId
    ? await Promise.all([listFixedExpenses(userId), getUserProfile(userId)])
    : [[], { notifyEmail: true }];

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

      <SettingsClientSections initialNotifyEmail={profile.notifyEmail} />
    </div>
  );
}
