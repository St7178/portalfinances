"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeForm } from "@/features/income/components/IncomeForm";
import { useUIStore } from "@/store/ui.store";
import { ExpenseForm } from "./ExpenseForm";

export function QuickAddModal() {
  const target = useUIStore((s) => s.quickAddTarget);
  const closeQuickAdd = useUIStore((s) => s.closeQuickAdd);
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && closeQuickAdd()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar movimiento</DialogTitle>
        </DialogHeader>
        <Tabs
          value={target ?? "expense"}
          onValueChange={(v) => openQuickAdd(v as "expense" | "income")}
        >
          <TabsList className="w-full">
            <TabsTrigger value="expense" className="flex-1">
              Gasto
            </TabsTrigger>
            <TabsTrigger value="income" className="flex-1">
              Ingreso
            </TabsTrigger>
          </TabsList>
          <TabsContent value="expense" className="pt-2">
            <ExpenseForm onSuccess={closeQuickAdd} />
          </TabsContent>
          <TabsContent value="income" className="pt-2">
            <IncomeForm onSuccess={closeQuickAdd} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
