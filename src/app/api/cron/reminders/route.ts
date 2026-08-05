import { format } from "date-fns";
import { es } from "date-fns/locale";
import { NextResponse } from "next/server";
import { FROM_EMAIL, isEmailConfigured, resend } from "@/lib/email/resend";
import { ReminderEmail, type ReminderItem } from "@/lib/email/templates/ReminderEmail";
import { db } from "@/lib/firebase/admin";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import type { FixedExpense } from "@/types";

function isLastDayOfMonth(date: Date): boolean {
  const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));
  return next.getUTCDate() === 1;
}

/**
 * Runs once a day (see vercel.json). Vercel invokes this with
 * `Authorization: Bearer $CRON_SECRET` automatically when CRON_SECRET is
 * set as an env var — see https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (DEMO_MODE || !isEmailConfigured || !db) {
    return NextResponse.json({ skipped: true, reason: "Firebase o Resend no configurados" });
  }

  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  const dueLabel = `Vence ${format(tomorrow, "d 'de' MMMM", { locale: es })}`;

  const isDueTomorrow = (fortnight: FixedExpense["fortnight"]) =>
    fortnight === "15" ? tomorrow.getUTCDate() === 15 : isLastDayOfMonth(tomorrow);

  const usersSnapshot = await db.collection("users").get();
  let emailsSent = 0;

  for (const userDoc of usersSnapshot.docs) {
    const profile = userDoc.data();
    if (profile.notifyEmail === false || !profile.email) continue;

    const fixedSnapshot = await db
      .collection("users")
      .doc(userDoc.id)
      .collection("fixedExpenses")
      .where("active", "==", true)
      .get();

    const dueItems: ReminderItem[] = fixedSnapshot.docs
      .map((doc) => doc.data() as FixedExpense)
      .filter((expense) => isDueTomorrow(expense.fortnight))
      .map((expense) => ({ name: expense.name, amount: expense.amount, dueLabel }));

    if (dueItems.length === 0) continue;

    await resend?.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      subject:
        dueItems.length === 1
          ? `${dueItems[0]?.name} vence mañana`
          : `${dueItems.length} pagos vencen mañana`,
      react: ReminderEmail({ userName: profile.name ?? "", items: dueItems }),
    });
    emailsSent++;
  }

  return NextResponse.json({ ok: true, usersChecked: usersSnapshot.size, emailsSent });
}
