"use client";

import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fr } from "@/lib/i18n/fr";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function CoachChatCard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content:
        "Je peux t'aider à interpréter ta semaine, pas décider à ta place. Dis-moi ce que tu veux comprendre."
    }
  ]);
  const [draft, setDraft] = useState("");

  function handleSend() {
    if (!draft.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: draft.trim()
    };

    startTransition(() => {
      setMessages((current) => [
        ...current,
        userMessage,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Dans le scaffold actuel, la réponse est simulée. Une fois Supabase et les Edge Functions branchées, le contexte 7 jours sera injecté ici."
        }
      ]);
      setDraft("");
    });
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
          Chat coaching contextuel
        </p>
        <p className="text-sm leading-6 text-muted-foreground">{fr.coachEmpty}</p>
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-3xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "bg-white/70 text-foreground" : "bg-[color:color-mix(in_oklab,oklch(var(--accent))_14%,white)] text-foreground"}`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ex: Pourquoi ma progression stagne sur le squat ?"
        />
        <Button onClick={handleSend}>Envoyer</Button>
      </div>
    </Card>
  );
}

