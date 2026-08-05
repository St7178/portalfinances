"use client";

import confetti from "canvas-confetti";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SavingsGoalCard } from "@/features/savings/components/SavingsGoalCard";
import { SavingsGoalForm } from "@/features/savings/components/SavingsGoalForm";
import { mockSavingsGoals } from "@/lib/mock/data";
import type { SavingsGoal } from "@/types";

const CONTRIBUTION_STEP = 150;

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>(mockSavingsGoals);
  const [open, setOpen] = useState(false);

  function handleContribute(id: string) {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id || goal.status !== "active") return goal;

        const nextAmount = Math.min(goal.targetAmount, goal.currentAmount + CONTRIBUTION_STEP);
        const justCompleted = nextAmount >= goal.targetAmount;

        if (justCompleted) {
          confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
          toast.success(`¡Meta "${goal.name}" completada! 🎉`);
        }

        return {
          ...goal,
          currentAmount: nextAmount,
          status: justCompleted ? "completed" : goal.status,
        };
      }),
    );
  }

  const active = goals.filter((g) => g.status !== "completed");
  const completed = goals.filter((g) => g.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {active.length} {active.length === 1 ? "meta activa" : "metas activas"} ·{" "}
          {completed.length} completadas
        </p>
        <Button className="gap-1.5" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nueva meta
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, i) => (
          <SavingsGoalCard
            key={goal.id}
            goal={goal}
            delay={i * 0.05}
            onContribute={handleContribute}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva meta de ahorro</DialogTitle>
          </DialogHeader>
          <SavingsGoalForm
            onSuccess={(values) => {
              setGoals((prev) => [
                ...prev,
                {
                  id: `g${prev.length + 1}`,
                  name: values.name,
                  targetAmount: values.targetAmount,
                  currentAmount: values.currentAmount,
                  color: values.color,
                  emoji: values.emoji,
                  status: values.currentAmount >= values.targetAmount ? "completed" : "active",
                },
              ]);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
