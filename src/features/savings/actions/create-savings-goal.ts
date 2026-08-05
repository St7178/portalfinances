"use server";

import { revalidatePath } from "next/cache";
import { savingsGoalSchema } from "@/features/savings/schemas/savings.schema";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export async function createSavingsGoal(data: unknown) {
  const parsed = savingsGoalSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  if (DEMO_MODE) {
    return { success: true as const, demo: true };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "No autorizado" };
  }

  await db
    ?.collection("users")
    .doc(session.user.id)
    .collection("savingsGoals")
    .add({ ...parsed.data, createdAt: new Date() });

  revalidatePath("/savings");

  return { success: true as const, demo: false };
}
