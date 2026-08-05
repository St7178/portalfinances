import { listSavingsGoals } from "@/features/savings/actions/list-savings-goals";
import { SavingsPageClient } from "@/features/savings/components/SavingsPageClient";
import { auth } from "@/lib/auth/config";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import { mockSavingsGoals } from "@/lib/mock/data";

export const dynamic = "force-dynamic";

export default async function SavingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const goals = DEMO_MODE || !userId ? mockSavingsGoals : await listSavingsGoals(userId);

  return <SavingsPageClient initialData={goals} />;
}
