import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import { listExpenses } from "@/features/expenses/actions/list-expenses";
import { listFixedExpenses } from "@/features/fixed-expenses/actions/list-fixed-expenses";
import { listIncomes } from "@/features/income/actions/list-incomes";
import { listSavingsGoals } from "@/features/savings/actions/list-savings-goals";
import { buildFinancialContext } from "@/lib/ai-context";
import { auth } from "@/lib/auth/config";
import { computeFinancialSummary } from "@/lib/financial-summary";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import { mockExpenses, mockIncomes, mockSummary } from "@/lib/mock/data";

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI no está activado todavía. Configura OPENAI_API_KEY." },
      { status: 503 },
    );
  }

  const session = await auth();
  const userId = session?.user?.id;
  const useMockData = DEMO_MODE || !userId;

  const context = useMockData
    ? buildFinancialContext({ expenses: mockExpenses, incomes: mockIncomes, summary: mockSummary })
    : buildFinancialContext(
        await (async () => {
          const [expenses, incomes, fixedExpenses, savingsGoals] = await Promise.all([
            listExpenses(userId),
            listIncomes(userId),
            listFixedExpenses(userId),
            listSavingsGoals(userId),
          ]);
          const summary = computeFinancialSummary(expenses, incomes, fixedExpenses, savingsGoals);
          return { expenses, incomes, summary };
        })(),
      );

  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `Eres un asesor financiero personal. Respondes en español, de forma concreta, empática y accionable. Usa siempre los datos reales del usuario que se te dan a continuación — nunca inventes cifras ni asumas datos que no están aquí.\n\n${context}`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
