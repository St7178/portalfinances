import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import type { SavingsGoal } from "@/types";

/** Plain server-side read (not a Server Action) — used by pages and the dashboard. */
export async function listSavingsGoals(userId: string): Promise<SavingsGoal[]> {
  if (DEMO_MODE) return [];

  const snapshot = await db
    ?.collection("users")
    .doc(userId)
    .collection("savingsGoals")
    .orderBy("createdAt", "asc")
    .get();

  if (!snapshot) return [];

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount,
      targetDate: data.targetDate?.toDate().toISOString(),
      color: data.color,
      emoji: data.emoji,
      status: data.status,
    } satisfies SavingsGoal;
  });
}
