"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { SavingsGoal } from "@/types";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  delay?: number;
  onContribute?: (id: string) => void;
}

export function SavingsGoalCard({ goal, delay = 0, onContribute }: SavingsGoalCardProps) {
  const progress = goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{goal.emoji}</span>
          <p className="text-sm font-medium">{goal.name}</p>
        </div>
        {goal.status === "completed" ? (
          <Badge className="bg-success/10 text-success hover:bg-success/10">Completada</Badge>
        ) : (
          onContribute && (
            <Button
              size="icon-xs"
              variant="outline"
              aria-label={`Agregar a ${goal.name}`}
              onClick={() => onContribute(goal.id)}
            >
              <Plus className="size-3" />
            </Button>
          )
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between text-xs text-muted-foreground">
        <span className="font-mono tabular-nums text-foreground">
          {formatCurrency(goal.currentAmount)}
        </span>
        <span>
          {formatPercent(progress)} de {formatCurrency(goal.targetAmount)}
        </span>
      </div>
      <ProgressBar
        value={goal.currentAmount}
        max={goal.targetAmount}
        className="mt-2"
        barClassName={goal.status === "completed" ? "bg-success" : undefined}
      />
    </motion.div>
  );
}
