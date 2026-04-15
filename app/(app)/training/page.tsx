"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";

import { ActionListCard } from "@/components/cards/action-list-card";
import { StateCard } from "@/components/cards/state-card";
import { ScreenShell } from "@/components/shell/screen-shell";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/offline/db";

export default function TrainingPage() {
  const workouts = useLiveQuery(() => db.plannedWorkouts.orderBy("date").toArray(), []);
  const templates = useLiveQuery(() => db.trainingTemplates.toArray(), []);
  const exercises = useLiveQuery(() => db.exercises.toArray(), []);

  return (
    <ScreenShell
      eyebrow="Entraînement"
      title="Programme actif et prochaines séances"
      action={<Button size="sm">Créer un exercice</Button>}
    >
      <section className="space-y-4">
        <SectionHeading
          title="Prochaines séances"
          description="Logger hors ligne reste prioritaire: les résultats sont enregistrés localement en moins de 200 ms puis synchronisés."
        />
        <div className="space-y-3">
          {workouts?.length ? (
            workouts.map((workout) => (
              <Card key={workout.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
                      {workout.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {workout.durationMinutes} min · {workout.exerciseIds.length} exercices
                    </p>
                  </div>
                  <Badge tone={workout.status === "completed" ? "success" : "accent"}>
                    {workout.status === "completed" ? "Complétée" : workout.dayLabel}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <Link href={`/training/session/${workout.id}`} className={buttonVariants({ className: "flex-1" })}>
                    Démarrer la séance
                  </Link>
                  <Button variant="secondary" className="flex-1">
                    Voir les perfs passées
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <StateCard
              title="Aucune séance planifiée"
              description="Termine l'onboarding ou choisis un template pour générer ta première semaine d'entraînement."
              badge={{ label: "Empty", tone: "default" }}
              cta={{ label: "Choisir un template" }}
            />
          )}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Templates de départ"
          description="Les templates servent de point d'entrée, jamais de carcan."
        />
        <div className="space-y-3">
          {templates?.map((template) => (
            <Card key={template.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{template.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {template.frequency} séances / semaine · {template.sessions.length} blocs
                  </p>
                </div>
                <Badge tone="default">{template.level}</Badge>
              </div>
              <Button variant="secondary">Choisir ce template</Button>
            </Card>
          ))}
        </div>
      </section>

      <ActionListCard
        title="Bibliothèque d'exercices"
        items={[
          `${exercises?.length ?? 0} exercices déjà présents dans la base locale.`,
          "Les exercices personnalisés doivent rester éditables et compatibles avec le logger série par série.",
          "Le dernier résultat connu devra remonter au démarrage de séance dans la phase suivante."
        ]}
      />
    </ScreenShell>
  );
}
