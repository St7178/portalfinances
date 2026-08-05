import { z } from "zod";

export const fixedExpenseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  amount: z.coerce.number().positive("El valor debe ser positivo"),
  fortnight: z.enum(["15", "30"]),
  category: z.string().min(1),
  active: z.boolean().default(true),
  order: z.number().int().nonnegative().default(0),
  paymentUrl: z
    .union([z.url("Debe ser un link http(s) válido"), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export type FixedExpenseFormInput = z.input<typeof fixedExpenseSchema>;
export type FixedExpenseFormValues = z.output<typeof fixedExpenseSchema>;
