"use client";

import { useMemo } from "react";
import { mockExpenses } from "@/lib/mock/data";
import type { Expense } from "@/types";

interface UseExpensesOptions {
  category?: string;
  search?: string;
}

/**
 * Reads from local mock data today. Swap the body for a `useQuery` against
 * Firestore once the free-tier project from SETUP.md is connected — callers
 * already consume this as async-shaped state so that swap needs no changes
 * upstream.
 */
export function useExpenses({ category, search }: UseExpensesOptions = {}) {
  const data = useMemo(() => {
    return mockExpenses
      .filter((e) => !category || category === "all" || e.category === category)
      .filter((e) => !search || e.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [category, search]);

  return { data, isLoading: false as const };
}

export function useExpenseTotals(expenses: Expense[]) {
  return useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
}
