"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFixedExpense } from "@/features/fixed-expenses/actions/create-fixed-expense";
import {
  type FixedExpenseFormInput,
  type FixedExpenseFormValues,
  fixedExpenseSchema,
} from "@/features/fixed-expenses/schemas/fixed-expense.schema";
import { EXPENSE_CATEGORIES, FORTNIGHT_LABELS } from "@/lib/constants";

interface FixedExpenseFormProps {
  onSuccess?: (values: FixedExpenseFormValues, demo: boolean) => void;
}

export function FixedExpenseForm({ onSuccess }: FixedExpenseFormProps) {
  const [pending, setPending] = useState(false);
  const form = useForm<FixedExpenseFormInput, unknown, FixedExpenseFormValues>({
    resolver: zodResolver(fixedExpenseSchema),
    defaultValues: {
      name: "",
      amount: 0,
      fortnight: "15",
      category: "",
      active: true,
      order: 0,
    },
  });

  async function onSubmit(values: FixedExpenseFormValues) {
    setPending(true);
    const result = await createFixedExpense(values);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(`"${values.name}" agregado`, {
      description: result.demo
        ? "Modo demo: conecta Firebase para guardar datos reales."
        : undefined,
    });
    form.reset();
    onSuccess?.(values, result.demo);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Internet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    value={field.value as number}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fortnight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quincena</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(FORTNIGHT_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Guardar gasto fijo
        </Button>
      </form>
    </Form>
  );
}
