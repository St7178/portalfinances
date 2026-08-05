"use server";

import { revalidatePath } from "next/cache";
import { fixedExpenseSchema } from "@/features/fixed-expenses/schemas/fixed-expense.schema";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export async function createFixedExpense(data: unknown) {
  const parsed = fixedExpenseSchema.safeParse(data);
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
    .collection("fixedExpenses")
    .add({
      ...parsed.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  revalidatePath("/settings");
  revalidatePath("/");

  return { success: true as const, demo: false };
}
