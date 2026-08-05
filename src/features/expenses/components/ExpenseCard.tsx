"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Car,
  Film,
  Heart,
  Home,
  type LucideIcon,
  MoreHorizontal,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRIORITY_LABELS } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { Expense } from "@/types";

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

const PRIORITY_DOT: Record<Expense["priority"], string> = {
  low: "bg-muted-foreground",
  medium: "bg-warning",
  high: "bg-danger",
};

export function ExpenseCard({
  expense,
  onDelete,
}: {
  expense: Expense;
  onDelete: (id: string) => void;
}) {
  const Icon = CATEGORY_ICON[expense.category] ?? ShoppingCart;

  return (
    <div className="flex items-center gap-3 border-b border-border px-1 py-3 last:border-b-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-medium">{expense.name}</p>
          <span
            className={cn("size-1.5 shrink-0 rounded-full", PRIORITY_DOT[expense.priority])}
            title={PRIORITY_LABELS[expense.priority]}
          />
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {expense.category} · {format(new Date(expense.date), "d MMM", { locale: es })}
        </p>
      </div>
      {expense.tags.length > 0 && (
        <div className="hidden gap-1 sm:flex">
          {expense.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <span className="shrink-0 font-mono text-sm font-medium tabular-nums">
        -{formatCurrency(expense.amount)}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onSelect={() => onDelete(expense.id)}>
            <Trash2 /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
