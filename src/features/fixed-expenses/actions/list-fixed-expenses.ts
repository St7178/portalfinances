import { cache } from "react";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import type { FixedExpense } from "@/types";

/**
 * Plain server-side read (not a Server Action — nothing here is triggered
 * from a client event). Used by the Settings page and the dashboard layout.
 * Wrapped in `cache()` so the layout (alerts) and a page that both need this
 * within the same request share one Firestore read.
 */
export const listFixedExpenses = cache(async function listFixedExpenses(
  userId: string,
): Promise<FixedExpense[]> {
  if (DEMO_MODE) return [];

  const snapshot = await db
    ?.collection("users")
    .doc(userId)
    .collection("fixedExpenses")
    .orderBy("order", "asc")
    .get();

  if (!snapshot) return [];

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      amount: data.amount,
      fortnight: data.fortnight,
      category: data.category,
      active: data.active,
      order: data.order,
      paymentUrl: data.paymentUrl,
      paidPeriods: data.paidPeriods ?? [],
    } satisfies FixedExpense;
  });
});
