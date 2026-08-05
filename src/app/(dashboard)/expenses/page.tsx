"use client";

import { Plus, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteExpense } from "@/features/expenses/actions/delete-expense";
import { ExpenseList } from "@/features/expenses/components/ExpenseList";
import { useUndoDelete } from "@/hooks/useUndoDelete";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { mockExpenses } from "@/lib/mock/data";
import { formatCurrency } from "@/lib/utils";
import { useUIStore } from "@/store/ui.store";
import type { Expense } from "@/types";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [category, setCategory] = useQueryState("category", { defaultValue: "all" });
  const [search, setSearch] = useQueryState("q", { defaultValue: "" });
  const { deleteWithUndo } = useUndoDelete();
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);

  const filtered = expenses
    .filter((e) => category === "all" || e.category === category)
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  function handleDelete(id: string) {
    const removed = expenses.find((e) => e.id === id);
    if (!removed) return;

    setExpenses((prev) => prev.filter((e) => e.id !== id));
    deleteWithUndo(
      () => deleteExpense(id),
      () => setExpenses((prev) => [...prev, removed].sort((a, b) => a.id.localeCompare(b.id))),
      removed.name,
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar gastos..."
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {EXPENSE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="gap-1.5 sm:w-auto" onClick={() => openQuickAdd("expense")}>
          <Plus className="size-4" />
          Agregar gasto
        </Button>
      </div>

      <div className="flex items-center justify-between px-1 text-sm text-muted-foreground">
        <span>
          {filtered.length} {filtered.length === 1 ? "gasto" : "gastos"}
        </span>
        <span className="font-mono font-medium text-foreground tabular-nums">
          {formatCurrency(total)}
        </span>
      </div>

      <Card>
        <CardContent>
          <ExpenseList expenses={filtered} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}
