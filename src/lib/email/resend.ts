import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const isEmailConfigured = Boolean(apiKey);
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Finanzas <onboarding@resend.dev>";

/**
 * `resend` is only safe to use when `isEmailConfigured` is true. Callers
 * that run on a schedule (the reminders cron) should skip the run entirely
 * rather than throw when the key isn't set — see the cron route.
 */
export const resend = apiKey ? new Resend(apiKey) : undefined;
