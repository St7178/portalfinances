import { BarChart3, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiAdvisorPanel } from "@/features/ai/components/AiAdvisorPanel";
import { ChatPanel } from "@/features/ai/components/ChatPanel";
import { InsightsPanel } from "@/features/ai/components/InsightsPanel";
import { PredictionsPanel } from "@/features/ai/components/PredictionsPanel";
import { listExpenses } from "@/features/expenses/actions/list-expenses";
import { listFixedExpenses } from "@/features/fixed-expenses/actions/list-fixed-expenses";
import { listIncomes } from "@/features/income/actions/list-incomes";
import { listSavingsGoals } from "@/features/savings/actions/list-savings-goals";
import { auth } from "@/lib/auth/config";
import { computeFinancialSummary } from "@/lib/financial-summary";
import { DEMO_MODE } from "@/lib/firebase/demo-mode";
import { computeInsights } from "@/lib/insights";
import { mockExpenses, mockIncomes, mockSavingsGoals, mockSummary } from "@/lib/mock/data";
import { computePredictions } from "@/lib/predictions";

export const dynamic = "force-dynamic";

export default async function AiPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const useMockData = DEMO_MODE || !userId;

  const [expenses, incomes, fixedExpenses, savingsGoals] = useMockData
    ? [mockExpenses, mockIncomes, [], mockSavingsGoals]
    : await Promise.all([
        listExpenses(userId),
        listIncomes(userId),
        listFixedExpenses(userId),
        listSavingsGoals(userId),
      ]);

  const summary = useMockData
    ? mockSummary
    : computeFinancialSummary(expenses, incomes, fixedExpenses, savingsGoals);

  const predictions = computePredictions(summary, savingsGoals);
  const insights = computeInsights(expenses);

  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/25">
        <Sparkles className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">Asesor financiero IA</h2>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Analiza tus movimientos reales y te da consejos, predicciones e insights accionables.
      </p>

      <Tabs defaultValue="analisis" className="mt-8 w-full max-w-2xl items-center">
        <TabsList>
          <TabsTrigger value="analisis" className="gap-1.5">
            <Sparkles className="size-4" /> Análisis
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-1.5">
            <MessageCircle className="size-4" /> Chat
          </TabsTrigger>
          <TabsTrigger value="predicciones" className="gap-1.5">
            <TrendingUp className="size-4" /> Predicciones
          </TabsTrigger>
          <TabsTrigger value="insights" className="gap-1.5">
            <BarChart3 className="size-4" /> Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analisis" className="mt-6 flex w-full justify-center">
          <AiAdvisorPanel data={{ expenses, incomes, summary }} />
        </TabsContent>

        <TabsContent value="chat" className="mt-6 flex w-full justify-center">
          <ChatPanel />
        </TabsContent>

        <TabsContent value="predicciones" className="mt-6 w-full max-w-2xl text-left">
          <PredictionsPanel predictions={predictions} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6 w-full max-w-2xl text-left">
          <InsightsPanel insights={insights} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
