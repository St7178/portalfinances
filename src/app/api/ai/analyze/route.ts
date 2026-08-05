import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

/**
 * STUB — inactive until OPENAI_API_KEY is set (see SETUP.md). Once
 * activated, pair this with `useChat()` from `@ai-sdk/react` in
 * features/ai/components for a streaming chat UI.
 */
export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI no está activado todavía. Configura OPENAI_API_KEY." },
      { status: 503 },
    );
  }

  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system:
      "Eres un asesor financiero personal. Analizas los patrones de gasto del usuario y das consejos concretos, empáticos y accionables en español.",
    messages,
  });

  return result.toUIMessageStreamResponse();
}
