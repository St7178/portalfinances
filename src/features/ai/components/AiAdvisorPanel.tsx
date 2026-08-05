"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFinancialAdvice } from "@/features/ai/actions/financial-advice";
import { mockExpenses, mockIncomes, mockSummary } from "@/lib/mock/data";

export function AiAdvisorPanel() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAnalyze() {
    setError(null);
    startTransition(async () => {
      try {
        const text = await getFinancialAdvice({
          expenses: mockExpenses,
          incomes: mockIncomes,
          summary: mockSummary,
        });
        setAdvice(text);
      } catch {
        setError(
          "No se pudo generar el análisis. Verifica que OPENAI_API_KEY esté configurada y con saldo.",
        );
      }
    });
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <Button onClick={handleAnalyze} disabled={isPending} size="lg" className="gap-2">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {isPending ? "Analizando..." : "Analizar mis finanzas"}
      </Button>

      {error && <p className="text-sm text-danger">{error}</p>}

      {advice && (
        <Card className="text-left">
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{advice}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
