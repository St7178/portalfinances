import { cache } from "react";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";

export interface UserProfile {
  notifyEmail: boolean;
  monthlySalary: number;
}

/**
 * Plain server-side read, not a Server Action — used by the Settings page
 * and the dashboard layout. Wrapped in `cache()` so both share one read.
 */
export const getUserProfile = cache(async function getUserProfile(
  userId: string,
): Promise<UserProfile> {
  if (DEMO_MODE) return { notifyEmail: true, monthlySalary: 0 };

  const snap = await db?.collection("users").doc(userId).get();
  const data = snap?.data();

  return {
    notifyEmail: data?.notifyEmail ?? true,
    monthlySalary: data?.monthlySalary ?? 0,
  };
});
