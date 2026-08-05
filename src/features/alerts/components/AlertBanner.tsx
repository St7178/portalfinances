"use client";

import { AlertTriangle, Info, TrendingDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AlertRule } from "@/types";

const severityIcon: Record<AlertRule["severity"], typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  danger: TrendingDown,
};

const severityClass: Record<AlertRule["severity"], string> = {
  info: "border-primary/20 bg-primary/5 text-primary",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

export function AlertBanner({ alerts }: { alerts: AlertRule[] }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = alerts.filter((a) => !dismissed.includes(a.id)).slice(0, 2);

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {visible.map((alert) => {
          const Icon = severityIcon[alert.severity];
          return (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
                severityClass[alert.severity],
              )}
            >
              <Icon className="size-4 shrink-0" />
              <p className="flex-1 text-foreground">{alert.message}</p>
              {alert.dismissible && (
                <button
                  type="button"
                  onClick={() => setDismissed((prev) => [...prev, alert.id])}
                  aria-label="Descartar alerta"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
