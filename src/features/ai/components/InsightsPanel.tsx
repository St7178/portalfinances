import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Insight } from "@/lib/insights";
import { cn } from "@/lib/utils";

const toneIcon: Record<Insight["tone"], typeof Lightbulb> = {
  positive: CheckCircle2,
  warning: AlertTriangle,
  neutral: Lightbulb,
};

const toneClass: Record<Insight["tone"], string> = {
  positive: "text-success",
  warning: "text-warning",
  neutral: "text-primary",
};

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  return (
    <Card>
      <CardContent className="divide-y divide-border p-0">
        {insights.map((insight) => {
          const Icon = toneIcon[insight.tone];
          return (
            <div
              key={insight.text}
              className="flex items-start gap-3 px-4 py-3.5 first:pt-4 last:pb-4"
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", toneClass[insight.tone])} />
              <p className="text-sm leading-relaxed text-foreground">{insight.text}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
