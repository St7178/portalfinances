"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { buildFinancialContext } from "@/lib/ai-context";
import type { SpendingData } from "@/types";

export async function getFinancialAdvice(data: SpendingData) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system:
      "Eres un asesor financiero personal. Analizas los patrones de gasto reales del usuario y das consejos concretos, empáticos y accionables en español. Usa únicamente las cifras que se te dan — nunca inventes datos.",
    prompt: `Analiza la situación financiera de este usuario y dale un análisis breve (máximo 4-5 párrafos cortos) con recomendaciones concretas:\n\n${buildFinancialContext(data)}`,
  });

  return text;
}
