"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export async function updateMonthlySalary(amount: number) {
  if (!Number.isFinite(amount) || amount < 0) {
    return { success: false as const, error: "El salario debe ser un valor positivo" };
  }

  if (DEMO_MODE) return { success: true as const, demo: true };

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "No autorizado" };
  }

  await db
    ?.collection("users")
    .doc(session.user.id)
    .update({ monthlySalary: amount, updatedAt: new Date() });

  revalidatePath("/settings");
  revalidatePath("/");
  revalidatePath("/analytics");

  return { success: true as const, demo: false };
}
