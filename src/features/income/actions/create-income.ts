"use server";

import { revalidatePath } from "next/cache";
import { incomeSchema } from "@/features/income/schemas/income.schema";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export async function createIncome(data: unknown) {
  const parsed = incomeSchema.safeParse(data);
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
    .collection("incomes")
    .add({
      ...parsed.data,
      createdAt: new Date(),
    });

  revalidatePath("/income");
  revalidatePath("/");

  return { success: true as const, demo: false };
}
