import { z } from "zod";

export const expenseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  amount: z.coerce.number().positive("El valor debe ser positivo"),
  category: z.string().min(1, "Selecciona una categoría"),
  date: z.coerce.date(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).max(10).default([]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  type: z.enum(["variable", "fixed", "recurring"]).default("variable"),
});

export type ExpenseFormInput = z.input<typeof expenseSchema>;
export type ExpenseFormValues = z.output<typeof expenseSchema>;
