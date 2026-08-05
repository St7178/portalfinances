import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Prediction } from "@/lib/predictions";
import { cn } from "@/lib/utils";

const toneClass: Record<Prediction["tone"], string> = {
  positive: "border-success/30 bg-success/5",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-danger/30 bg-danger/5",
  neutral: "border-border bg-card",
};

const valueToneClass: Record<Prediction["tone"], string> = {
  positive: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-foreground",
};

export function PredictionsPanel({ predictions }: { predictions: Prediction[] }) {
  if (predictions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <TrendingUp className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Registra ingresos y gastos este mes para ver proyecciones aquí.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {predictions.map((prediction) => (
        <Card key={prediction.label} className={cn("text-left", toneClass[prediction.tone])}>
          <CardContent className="space-y-1">
            <p className="text-xs text-muted-foreground">{prediction.label}</p>
            <p
              className={cn("text-lg font-semibold tabular-nums", valueToneClass[prediction.tone])}
            >
              {prediction.value}
            </p>
            {prediction.detail && (
              <p className="text-xs text-muted-foreground">{prediction.detail}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
