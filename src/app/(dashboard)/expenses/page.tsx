import { listExpenses } from "@/features/expenses/actions/list-expenses";
import { ExpensesPageClient } from "@/features/expenses/components/ExpensesPageClient";
import { auth } from "@/lib/auth/config";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import { mockExpenses } from "@/lib/mock/data";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const expenses = DEMO_MODE || !userId ? mockExpenses : await listExpenses(userId);

  return <ExpensesPageClient initialData={expenses} />;
}
