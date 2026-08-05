"use client";

import { CalendarClock, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { deleteFixedExpense } from "@/features/fixed-expenses/actions/delete-fixed-expense";
import { toggleFixedExpense } from "@/features/fixed-expenses/actions/toggle-fixed-expense";
import { FixedExpenseForm } from "@/features/fixed-expenses/components/FixedExpenseForm";
import { useUndoDelete } from "@/hooks/useUndoDelete";
import { FORTNIGHT_LABELS } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { FixedExpense } from "@/types";

export function FixedExpensesManager({ initialData }: { initialData: FixedExpense[] }) {
  const [items, setItems] = useState<FixedExpense[]>(initialData);
  const [open, setOpen] = useState(false);
  const { deleteWithUndo } = useUndoDelete();
  const router = useRouter();

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  function handleToggle(id: string, active: boolean) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, active } : i)));
    void toggleFixedExpense(id, active);
  }

  function handleDelete(id: string) {
    const removed = items.find((i) => i.id === id);
    if (!removed) return;

    setItems((prev) => prev.filter((i) => i.id !== id));
    deleteWithUndo(
      () => deleteFixedExpense(id),
      () => setItems((prev) => [...prev, removed]),
      removed.name,
    );
  }

  const byFortnight = {
    "15": items.filter((i) => i.fortnight === "15"),
    "30": items.filter((i) => i.fortnight === "30"),
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "gasto fijo" : "gastos fijos"} · usados para
          recordatorios por correo
        </p>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="size-3.5" />
          Agregar
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Sin gastos fijos"
          description="Agrega tus pagos recurrentes (arriendo, servicios, suscripciones) para recibir recordatorios."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(["15", "30"] as const).map((fortnight) => (
            <div key={fortnight} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                {FORTNIGHT_LABELS[fortnight]}
              </p>
              <div className="rounded-xl border border-border">
                {byFortnight[fortnight].length === 0 ? (
                  <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                    Nada aquí todavía
                  </p>
                ) : (
                  byFortnight[fortnight].map((item, i) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5",
                        i > 0 && "border-t border-border",
                        !item.active && "opacity-50",
                      )}
                    >
                      <Switch
                        checked={item.active}
                        onCheckedChange={(checked) => handleToggle(item.id, checked)}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <span className="shrink-0 font-mono text-sm tabular-nums">
                        {formatCurrency(item.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="shrink-0 text-muted-foreground hover:text-danger"
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo gasto fijo</DialogTitle>
          </DialogHeader>
          <FixedExpenseForm
            onSuccess={(values, demo) => {
              setOpen(false);
              if (demo) {
                setItems((prev) => [...prev, { ...values, id: `demo-${Date.now()}` }]);
              } else {
                router.refresh();
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
