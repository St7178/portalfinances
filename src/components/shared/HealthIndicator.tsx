"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface HealthIndicatorProps {
  score: number;
  className?: string;
}

const SIZE = 96;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getStatus(score: number) {
  if (score >= 75) return { label: "Saludable", color: "var(--color-success)" };
  if (score >= 45) return { label: "Regular", color: "var(--color-warning)" };
  return { label: "En riesgo", color: "var(--color-danger)" };
}

export function HealthIndicator({ score, className }: HealthIndicatorProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const { label, color } = getStatus(clamped);
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-semibold tabular-nums">{Math.round(clamped)}</span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium">Salud financiera</p>
        <p className="text-xs" style={{ color }}>
          {label}
        </p>
        <p className="mt-1 max-w-40 text-xs text-muted-foreground">
          Basado en tu presupuesto y patrones de gasto del mes.
        </p>
      </div>
    </div>
  );
}
