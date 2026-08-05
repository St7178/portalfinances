"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { SpendingData } from "@/types";

/**
 * STUB — inactive until GOOGLE_GENERATIVE_AI_API_KEY is set (see SETUP.md).
 * Gemini 2.0 Flash has a genuinely free tier, so it's the default provider;
 * swapping to `@ai-sdk/openai` or `@ai-sdk/anthropic` later is a one-line
 * change since the UI only talks to the Vercel AI SDK abstraction.
 */
export async function getFinancialAdvice(data: SpendingData) {
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system:
      "Eres un asesor financiero personal. Analizas los patrones de gasto del usuario y das consejos concretos, empáticos y accionables en español.",
    prompt: `Analiza estos datos financieros: ${JSON.stringify(data)}`,
  });

  return text;
}
