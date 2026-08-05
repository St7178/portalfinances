import { z } from "zod";

export const savingsGoalSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  targetAmount: z.coerce.number().positive("La meta debe ser positiva"),
  currentAmount: z.coerce.number().nonnegative().default(0),
  targetDate: z.coerce.date().optional(),
  color: z.string().min(1).default("var(--color-primary)"),
  emoji: z.string().max(8).optional(),
  status: z.enum(["active", "completed", "paused"]).default("active"),
});

export type SavingsGoalFormInput = z.input<typeof savingsGoalSchema>;
export type SavingsGoalFormValues = z.output<typeof savingsGoalSchema>;
