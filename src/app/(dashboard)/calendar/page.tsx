import { CalendarPageClient } from "@/features/calendar/components/CalendarPageClient";
import { listExpenses } from "@/features/expenses/actions/list-expenses";
import { listFixedExpenses } from "@/features/fixed-expenses/actions/list-fixed-expenses";
import { listIncomes } from "@/features/income/actions/list-incomes";
import { auth } from "@/lib/auth/config";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import { mockExpenses, mockFixedExpenses, mockIncomes } from "@/lib/mock/data";

export default async function CalendarPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const useMockData = DEMO_MODE || !userId;

  const [expenses, incomes, fixedExpenses] = useMockData
    ? [mockExpenses, mockIncomes, mockFixedExpenses]
    : await Promise.all([listExpenses(userId), listIncomes(userId), listFixedExpenses(userId)]);

  return <CalendarPageClient expenses={expenses} incomes={incomes} fixedExpenses={fixedExpenses} />;
}
