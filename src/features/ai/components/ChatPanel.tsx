"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "¿En qué categoría gasté más este mes?",
  "¿Puedo alcanzar mis metas de ahorro con mi ritmo actual?",
  "¿Cómo puedo reducir mis gastos fijos?",
];

export function ChatPanel() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  });

  const isBusy = status === "submitted" || status === "streaming";

  function submit(text: string) {
    if (!text.trim() || isBusy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <div className="min-h-[16rem] space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Sparkles className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Pregúntale a tu asesor IA sobre tus finanzas.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <Card
            key={message.id}
            className={cn("text-left", message.role === "user" ? "ml-8 bg-muted/50" : "mr-8")}
          >
            <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("")}
            </CardContent>
          </Card>
        ))}

        {status === "submitted" && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" /> Pensando...
          </p>
        )}
        {error && (
          <p className="text-sm text-danger">
            No se pudo enviar el mensaje. Verifica que OPENAI_API_KEY esté configurada y con saldo.
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          disabled={isBusy}
          className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2 disabled:opacity-50"
        />
        <Button type="submit" size="icon" disabled={isBusy || !input.trim()}>
          {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>
    </div>
  );
}
