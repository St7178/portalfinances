import type { Fortnight } from "@/types";

/**
 * The key identifying which recurring occurrence a fixed expense's "paid"
 * checkbox refers to — stable for the whole current fortnight/month, so it
 * naturally resets (nothing paid) the moment the period rolls over, with no
 * cron job needed to clear it.
 */
export function currentFortnightPeriodKey(
  fortnight: Fortnight,
  referenceDate = new Date(),
): string {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const day = fortnight === "15" ? 15 : new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
