import { z } from "zod";

export const incomeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  amount: z.coerce.number().positive("El valor debe ser positivo"),
  type: z.enum(["salary", "freelance", "bonus", "rent", "dividends", "other"]),
  date: z.coerce.date(),
  description: z.string().max(500).optional(),
});

export type IncomeFormInput = z.input<typeof incomeSchema>;
export type IncomeFormValues = z.output<typeof incomeSchema>;
