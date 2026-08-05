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
import { createSavingsGoal } from "@/features/savings/actions/create-savings-goal";
import {
  type SavingsGoalFormInput,
  type SavingsGoalFormValues,
  savingsGoalSchema,
} from "@/features/savings/schemas/savings.schema";

const EMOJI_OPTIONS = ["🎯", "🏍️", "✈️", "🏠", "🎓", "💻", "🛡️", "🎁"];

export function SavingsGoalForm({
  onSuccess,
}: {
  onSuccess?: (values: SavingsGoalFormValues) => void;
}) {
  const [pending, setPending] = useState(false);
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);

  const form = useForm<SavingsGoalFormInput, unknown, SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      color: "var(--color-chart-1)",
      emoji: EMOJI_OPTIONS[0],
      status: "active",
    },
  });

  async function onSubmit(values: SavingsGoalFormValues) {
    setPending(true);
    const result = await createSavingsGoal(values);
    setPending(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(`Meta "${values.name}" creada`, {
      description: result.demo
        ? "Modo demo: conecta Firebase para guardar datos reales."
        : undefined,
    });
    form.reset();
    onSuccess?.(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                setEmoji(e);
                form.setValue("emoji", e);
              }}
              className={`flex size-9 items-center justify-center rounded-lg border text-lg transition-colors ${
                emoji === e ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la meta</FormLabel>
              <FormControl>
                <Input placeholder="Viaje a Japón" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta</FormLabel>
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
            name="currentAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ya ahorrado</FormLabel>
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
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          Crear meta
        </Button>
      </form>
    </Form>
  );
}
