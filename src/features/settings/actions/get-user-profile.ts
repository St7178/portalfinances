import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export interface UserProfile {
  notifyEmail: boolean;
}

/** Plain server-side read, not a Server Action — used by the Settings page. */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  if (DEMO_MODE) return { notifyEmail: true };

  const snap = await db?.collection("users").doc(userId).get();
  const data = snap?.data();

  return { notifyEmail: data?.notifyEmail ?? true };
}
