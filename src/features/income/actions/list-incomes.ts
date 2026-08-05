import { cache } from "react";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import type { Income } from "@/types";

/**
 * Plain server-side read (not a Server Action) — used by pages and the
 * dashboard layout. Wrapped in `cache()` so the layout (alerts) and a page
 * that both need this within the same request share one Firestore read.
 */
export const listIncomes = cache(async function listIncomes(userId: string): Promise<Income[]> {
  if (DEMO_MODE) return [];

  const snapshot = await db
    ?.collection("users")
    .doc(userId)
    .collection("incomes")
    .orderBy("date", "desc")
    .get();

  if (!snapshot) return [];

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      amount: data.amount,
      type: data.type,
      date: data.date.toDate().toISOString(),
      description: data.description,
    } satisfies Income;
  });
});
