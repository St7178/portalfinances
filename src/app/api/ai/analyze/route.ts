import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

/**
 * STUB — inactive until GOOGLE_GENERATIVE_AI_API_KEY is set (see SETUP.md).
 * Once activated, pair this with `useChat()` from `@ai-sdk/react` in
 * features/ai/components for a streaming chat UI.
 */
export async function POST(request: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "AI no está activado todavía. Configura GOOGLE_GENERATIVE_AI_API_KEY." },
      { status: 503 },
    );
  }

  const { messages } = await request.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system:
      "Eres un asesor financiero personal. Analizas los patrones de gasto del usuario y das consejos concretos, empáticos y accionables en español.",
    messages,
  });

  return result.toUIMessageStreamResponse();
}
