"use client";

import confetti from "canvas-confetti";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { contributeToSavingsGoal } from "@/features/savings/actions/contribute-to-savings-goal";
import { SavingsGoalCard } from "@/features/savings/components/SavingsGoalCard";
import { SavingsGoalForm } from "@/features/savings/components/SavingsGoalForm";
import type { SavingsGoal } from "@/types";

const CONTRIBUTION_STEP = 500_000;

export function SavingsPageClient({ initialData }: { initialData: SavingsGoal[] }) {
  const [goals, setGoals] = useState<SavingsGoal[]>(initialData);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setGoals(initialData);
  }, [initialData]);

  function handleContribute(id: string) {
    const goal = goals.find((g) => g.id === id);
    if (goal?.status !== "active") return;

    const nextAmount = Math.min(goal.targetAmount, goal.currentAmount + CONTRIBUTION_STEP);
    const justCompleted = nextAmount >= goal.targetAmount;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, currentAmount: nextAmount, status: justCompleted ? "completed" : g.status }
          : g,
      ),
    );

    if (justCompleted) {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      toast.success(`¡Meta "${goal.name}" completada! 🎉`);
    }

    void contributeToSavingsGoal(id, CONTRIBUTION_STEP);
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
            onSuccess={(values, demo) => {
              setOpen(false);
              if (demo) {
                setGoals((prev) => [
                  ...prev,
                  {
                    id: `demo-${Date.now()}`,
                    name: values.name,
                    targetAmount: values.targetAmount,
                    currentAmount: values.currentAmount,
                    color: values.color,
                    emoji: values.emoji,
                    status: values.currentAmount >= values.targetAmount ? "completed" : "active",
                  },
                ]);
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
