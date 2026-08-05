"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export async function toggleFixedExpense(id: string, active: boolean) {
  if (DEMO_MODE) return { success: true as const, demo: true };

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "No autorizado" };
  }

  await db
    ?.collection("users")
    .doc(session.user.id)
    .collection("fixedExpenses")
    .doc(id)
    .update({ active, updatedAt: new Date() });

  revalidatePath("/settings");
  revalidatePath("/");

  return { success: true as const, demo: false };
}
