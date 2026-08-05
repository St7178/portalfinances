"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Car,
  Film,
  Heart,
  Home,
  type LucideIcon,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Wallet2,
} from "lucide-react";
import { motion } from "motion/react";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn, formatCurrency } from "@/lib/utils";
import type { Expense, Income } from "@/types";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Alimentación: ShoppingCart,
  Transporte: Car,
  Entretenimiento: Film,
  Salud: Heart,
  Educación: Sparkles,
  Ropa: ShoppingBag,
  Hogar: Home,
  Tecnología: Smartphone,
  Suscripciones: Smartphone,
};

type Transaction = ({ kind: "expense" } & Expense) | ({ kind: "income" } & Income);

interface RecentTransactionsProps {
  expenses: Expense[];
  incomes: Income[];
  limit?: number;
}

export function RecentTransactions({ expenses, incomes, limit = 6 }: RecentTransactionsProps) {
  const transactions: Transaction[] = [
    ...expenses.map((e) => ({ kind: "expense" as const, ...e })),
    ...incomes.map((i) => ({ kind: "income" as const, ...i })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Wallet2}
        title="Sin movimientos todavía"
        description="Agrega tu primer gasto o ingreso para verlo aquí."
      />
    );
  }

  return (
    <ul className="divide-y divide-border">
      {transactions.map((t, index) => {
        const isIncome = t.kind === "income";
        const Icon = isIncome ? Wallet2 : (CATEGORY_ICON[t.category] ?? ShoppingCart);

        return (
          <motion.li
            key={`${t.kind}-${t.id}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className="flex items-center gap-3 py-2.5"
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full",
                isIncome ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {isIncome ? "Ingreso" : t.category} ·{" "}
                {format(new Date(t.date), "d MMM", { locale: es })}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 font-mono text-sm font-medium tabular-nums",
                isIncome ? "text-success" : "text-foreground",
              )}
            >
              {isIncome ? "+" : "-"}
              {formatCurrency(t.amount)}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
