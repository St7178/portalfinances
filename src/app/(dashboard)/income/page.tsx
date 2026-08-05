"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Wallet2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteIncome } from "@/features/income/actions/delete-income";
import { useUndoDelete } from "@/hooks/useUndoDelete";
import { INCOME_TYPE_LABELS } from "@/lib/constants";
import { mockIncomes } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import type { Income } from "@/types";

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>(mockIncomes);
  const { deleteWithUndo } = useUndoDelete();
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);

  const sorted = [...incomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const total = sorted.reduce((sum, i) => sum + i.amount, 0);

  function handleDelete(id: string) {
    const removed = incomes.find((i) => i.id === id);
    if (!removed) return;

    setIncomes((prev) => prev.filter((i) => i.id !== id));
    deleteWithUndo(
      () => deleteIncome(id),
      () => setIncomes((prev) => [...prev, removed]),
      removed.name,
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total de ingresos</p>
          <p className="text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
        </div>
        <Button className="gap-1.5" onClick={() => openQuickAdd("income")}>
          <Plus className="size-4" />
          Registrar ingreso
        </Button>
      </div>

      <Card>
        <CardContent>
          {sorted.length === 0 ? (
            <EmptyState
              icon={Wallet2}
              title="Sin ingresos registrados"
              description="Registra tu primer ingreso para verlo aquí."
            />
          ) : (
            <ul className="divide-y divide-border">
              {sorted.map((income, index) => (
                <motion.li
                  key={income.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="group flex items-center gap-3 py-3"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <Wallet2 className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{income.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {INCOME_TYPE_LABELS[income.type]} ·{" "}
                      {format(new Date(income.date), "d MMM yyyy", { locale: es })}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-medium tabular-nums text-success">
                    +{formatCurrency(income.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(income.id)}
                    className="shrink-0 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                  >
                    Eliminar
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
