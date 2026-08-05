"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { SpendingData } from "@/types";

/**
 * STUB — inactive until OPENAI_API_KEY is set (see SETUP.md). The UI only
 * talks to the Vercel AI SDK abstraction, so swapping providers is a
 * one-line change here.
 */
export async function getFinancialAdvice(data: SpendingData) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system:
      "Eres un asesor financiero personal. Analizas los patrones de gasto del usuario y das consejos concretos, empáticos y accionables en español.",
    prompt: `Analiza estos datos financieros: ${JSON.stringify(data)}`,
  });

  return text;
}
