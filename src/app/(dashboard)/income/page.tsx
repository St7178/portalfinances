import { listIncomes } from "@/features/income/actions/list-incomes";
import { IncomePageClient } from "@/features/income/components/IncomePageClient";
import { auth } from "@/lib/auth/config";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import { mockIncomes } from "@/lib/mock/data";

export default async function IncomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const incomes = DEMO_MODE || !userId ? mockIncomes : await listIncomes(userId);

  return <IncomePageClient initialData={incomes} />;
}
