import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import type { Expense } from "@/types";

/** Plain server-side read (not a Server Action) — used by pages and the dashboard. */
export async function listExpenses(userId: string): Promise<Expense[]> {
  if (DEMO_MODE) return [];

  const snapshot = await db
    ?.collection("users")
    .doc(userId)
    .collection("expenses")
    .orderBy("date", "desc")
    .get();

  if (!snapshot) return [];

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      amount: data.amount,
      category: data.category,
      date: data.date.toDate().toISOString(),
      description: data.description,
      tags: data.tags ?? [],
      priority: data.priority,
      type: data.type,
      createdAt: data.createdAt?.toDate().toISOString() ?? data.date.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString() ?? data.date.toDate().toISOString(),
    } satisfies Expense;
  });
}
