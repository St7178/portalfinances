"use server";

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export async function toggleEmailNotifications(notifyEmail: boolean) {
  if (DEMO_MODE) return { success: true as const, demo: true };

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "No autorizado" };
  }

  await db?.collection("users").doc(session.user.id).update({ notifyEmail });

  return { success: true as const, demo: false };
}
