"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { CoachChatCard } from "@/components/cards/coach-chat-card";
import { StateCard } from "@/components/cards/state-card";
import { ScreenShell } from "@/components/shell/screen-shell";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/offline/db";

export default function CoachPage() {
  const recommendations = useLiveQuery(() => db.recommendations.toArray(), []);

  return (
    <ScreenShell eyebrow="Coach IA" title="Conseils contextuels, jamais imposés">
      <CoachChatCard />

      <section className="space-y-4">
        <SectionHeading
          title="Historique des recommandations"
          description="Chaque suggestion doit expliquer pourquoi elle apparaît et quel impact elle vise."
        />
        <div className="space-y-3">
          {recommendations?.length ? (
            recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{recommendation.context}</p>
                    <p className="text-sm leading-6 text-muted-foreground">{recommendation.suggestion}</p>
                  </div>
                  <Badge tone={recommendation.status === "accepted" ? "success" : "accent"}>
                    {recommendation.status === "accepted" ? "Acceptée" : "À valider"}
                  </Badge>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{recommendation.justification}</p>
                <div className="flex gap-3">
                  <Button className="flex-1">Accepter</Button>
                  <Button variant="secondary" className="flex-1">
                    Refuser
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <StateCard
              title="Le Coach IA attend plus de contexte"
              description="Pose une question dans le chat ou complète quelques jours de suivi pour recevoir des recommandations vraiment utiles."
              badge={{ label: "Empty", tone: "default" }}
              cta={{ label: "Lancer une première question" }}
            />
          )}
        </div>
      </section>
    </ScreenShell>
  );
}
