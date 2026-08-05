"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export async function contributeToSavingsGoal(id: string, amount: number) {
  if (DEMO_MODE) return { success: true as const, demo: true, completed: false };

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "No autorizado" };
  }

  const ref = db?.collection("users").doc(session.user.id).collection("savingsGoals").doc(id);

  const snap = await ref?.get();
  const data = snap?.data();
  if (!data) {
    return { success: false as const, error: "Meta no encontrada" };
  }

  const nextAmount = Math.min(data.targetAmount, data.currentAmount + amount);
  const completed = nextAmount >= data.targetAmount;

  await ref?.update({
    currentAmount: nextAmount,
    status: completed ? "completed" : data.status,
  });

  revalidatePath("/savings");
  revalidatePath("/");

  return { success: true as const, demo: false, completed };
}
