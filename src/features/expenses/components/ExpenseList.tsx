"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { Receipt } from "lucide-react";
import { useRef } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ExpenseCard } from "@/features/expenses/components/ExpenseCard";
import type { Expense } from "@/types";

const ROW_HEIGHT = 65;

export function ExpenseList({
  expenses,
  onDelete,
}: {
  expenses: Expense[];
  onDelete: (id: string) => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: expenses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No hay gastos que coincidan"
        description="Ajusta los filtros o agrega un nuevo gasto."
      />
    );
  }

  return (
    <div ref={parentRef} className="max-h-[560px] overflow-y-auto">
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((row) => {
          const expense = expenses[row.index];
          if (!expense) return null;
          return (
            <div
              key={expense.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: row.size,
                transform: `translateY(${row.start}px)`,
              }}
            >
              <ExpenseCard expense={expense} onDelete={onDelete} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
