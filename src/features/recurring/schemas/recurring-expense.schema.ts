import { z } from "zod";

export const recurringExpenseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  amount: z.coerce.number().positive("El valor debe ser positivo"),
  category: z.string().min(1),
  frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "yearly"]),
  startDate: z.coerce.date(),
  skipWeekends: z.boolean().default(true),
  active: z.boolean().default(true),
});

export type RecurringExpenseFormValues = z.infer<typeof recurringExpenseSchema>;
