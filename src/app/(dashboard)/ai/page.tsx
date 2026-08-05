import { BarChart3, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AiAdvisorPanel } from "@/features/ai/components/AiAdvisorPanel";

const UPCOMING_FEATURES = [
  {
    icon: MessageCircle,
    title: "Chat financiero",
    description: "Pregúntale a tu asesor IA sobre tus hábitos de gasto en lenguaje natural.",
  },
  {
    icon: TrendingUp,
    title: "Predicciones",
    description:
      "Proyecciones de gasto y alertas tempranas antes de que te excedas del presupuesto.",
  },
  {
    icon: BarChart3,
    title: "Insights automáticos",
    description: "Patrones y anomalías detectadas en tus finanzas, explicados en español simple.",
  },
];

export default function AiPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/25">
        <Sparkles className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">Asesor financiero IA</h2>
      <p className="mt-2 text-xs text-muted-foreground">Impulsado por OpenAI · gpt-4o-mini</p>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Analiza tus movimientos recientes y te da consejos concretos y accionables.
      </p>

      <div className="mt-8">
        <AiAdvisorPanel />
      </div>

      <div className="mt-16 w-full max-w-3xl">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Badge variant="secondary">Próximamente</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {UPCOMING_FEATURES.map((feature) => (
            <Card key={feature.title} className="text-left">
              <CardContent className="space-y-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <feature.icon className="size-4" />
                </span>
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
