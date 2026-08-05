"use client";

import { AlertTriangle, Bell, Info, TrendingDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { mockAlerts } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import type { AlertRule } from "@/types";

const severityIcon: Record<AlertRule["severity"], typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  danger: TrendingDown,
};

const severityClass: Record<AlertRule["severity"], string> = {
  info: "text-primary bg-primary/10",
  warning: "text-warning bg-warning/15",
  danger: "text-danger bg-danger/10",
};

export function AlertsPopover() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const alerts = mockAlerts.filter((a) => !dismissed.includes(a.id));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="size-4" />
          {alerts.length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-danger">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-75" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">Alertas</p>
          <span className="text-xs text-muted-foreground">{alerts.length} activas</span>
        </div>
        <Separator />
        {alerts.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No tienes alertas pendientes.
          </p>
        ) : (
          <ul className="max-h-80 divide-y divide-border overflow-y-auto">
            {alerts.map((alert) => {
              const Icon = severityIcon[alert.severity];
              return (
                <li key={alert.id} className="flex items-start gap-3 px-4 py-3">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full",
                      severityClass[alert.severity],
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <p className="flex-1 text-sm leading-snug">{alert.message}</p>
                  <button
                    type="button"
                    onClick={() => setDismissed((prev) => [...prev, alert.id])}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
