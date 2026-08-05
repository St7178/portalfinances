"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  lastDayOfMonth,
  setDate,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn, formatCurrency } from "@/lib/utils";
import type { CalendarEvent, Expense, FixedExpense, Income } from "@/types";

const KIND_DOT: Record<CalendarEvent["kind"], string> = {
  expense: "bg-danger",
  income: "bg-success",
  fixed: "bg-primary",
  reminder: "bg-warning",
};

const KIND_LABEL: Record<CalendarEvent["kind"], string> = {
  expense: "Gasto",
  income: "Ingreso",
  fixed: "Gasto fijo",
  reminder: "Recordatorio",
};

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface CalendarPageClientProps {
  expenses: Expense[];
  incomes: Income[];
  fixedExpenses: FixedExpense[];
  extraEvents?: CalendarEvent[];
}

function fixedExpenseOccurrences(fixedExpenses: FixedExpense[], month: Date): CalendarEvent[] {
  const dueDate = (fortnight: FixedExpense["fortnight"]) =>
    fortnight === "15" ? setDate(month, 15) : lastDayOfMonth(month);

  return fixedExpenses
    .filter((f) => f.active)
    .map((f) => ({
      id: `fixed-${f.id}-${format(month, "yyyy-MM")}`,
      date: dueDate(f.fortnight).toISOString(),
      kind: "fixed" as const,
      label: f.name,
      amount: f.amount,
    }));
}

export function CalendarPageClient({
  expenses,
  incomes,
  fixedExpenses,
  extraEvents = [],
}: CalendarPageClientProps) {
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const eventsByDay = useMemo(() => {
    const allEvents: CalendarEvent[] = [
      ...expenses.map((e) => ({
        id: `exp-${e.id}`,
        date: e.date,
        kind: "expense" as const,
        label: e.name,
        amount: e.amount,
      })),
      ...incomes.map((i) => ({
        id: `inc-${i.id}`,
        date: i.date,
        kind: "income" as const,
        label: i.name,
        amount: i.amount,
      })),
      ...fixedExpenseOccurrences(fixedExpenses, month),
      ...fixedExpenseOccurrences(fixedExpenses, addMonths(month, 1)),
      ...fixedExpenseOccurrences(fixedExpenses, subMonths(month, 1)),
      ...extraEvents,
    ];

    const map = new Map<string, CalendarEvent[]>();
    for (const event of allEvents) {
      const key = format(new Date(event.date), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), event]);
    }
    return map;
  }, [expenses, incomes, fixedExpenses, extraEvents, month]);

  const selectedEvents = selectedDay
    ? (eventsByDay.get(format(selectedDay, "yyyy-MM-dd")) ?? [])
    : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize tracking-tight">
          {format(month, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => setMonth(new Date())}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" onClick={() => setMonth((m) => subMonths(m, 1))}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setMonth((m) => addMonths(m, 1))}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {(Object.keys(KIND_LABEL) as CalendarEvent["kind"][]).map((kind) => (
          <span key={kind} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", KIND_DOT[kind])} />
            {KIND_LABEL[kind]}
          </span>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const events = eventsByDay.get(key) ?? [];
            const inMonth = isSameMonth(day, month);

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "flex h-24 flex-col gap-1 border-b border-r border-border p-2 text-left transition-colors last:border-r-0 hover:bg-muted/50",
                  !inMonth && "bg-muted/20 text-muted-foreground/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                    isToday(day) && "bg-primary text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
                <div className="flex flex-wrap gap-1">
                  {events.slice(0, 4).map((event) => (
                    <span
                      key={event.id}
                      className={cn("size-1.5 rounded-full", KIND_DOT[event.kind])}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Drawer open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="capitalize">
              {selectedDay && format(selectedDay, "EEEE d 'de' MMMM", { locale: es })}
            </DrawerTitle>
          </DrawerHeader>
          <div className="space-y-2 px-4 pb-6">
            {selectedEvents.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Sin movimientos este día.
              </p>
            ) : (
              selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5"
                >
                  <span className={cn("size-2 shrink-0 rounded-full", KIND_DOT[event.kind])} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{event.label}</p>
                    <p className="text-xs text-muted-foreground">{KIND_LABEL[event.kind]}</p>
                  </div>
                  {event.amount !== undefined && (
                    <span className="shrink-0 font-mono text-sm font-medium tabular-nums">
                      {formatCurrency(event.amount)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
