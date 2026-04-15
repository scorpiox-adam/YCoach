"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowRight, Flame, NotebookTabs } from "lucide-react";

import { ActionListCard } from "@/components/cards/action-list-card";
import { MetricCard } from "@/components/cards/metric-card";
import { StateCard } from "@/components/cards/state-card";
import { ScreenShell } from "@/components/shell/screen-shell";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/offline/db";
import { formatKg, formatPercent, formatShortDate } from "@/lib/utils";

export default function AgendaPage() {
  const profile = useLiveQuery(() => db.profile.get("user-demo"), []);
  const workouts = useLiveQuery(() => db.plannedWorkouts.orderBy("date").toArray(), []);
  const meals = useLiveQuery(() => db.mealEntries.toArray(), []);
  const recommendations = useLiveQuery(() => db.recommendations.toArray(), []);

  const todayWorkout = workouts?.[0];
  const mealCalories =
    meals?.reduce(
      (sum, meal) => sum + meal.items.reduce((itemTotal, item) => itemTotal + item.calories, 0),
      0
    ) ?? 0;

  return (
    <ScreenShell
      eyebrow="Agenda"
      title="Aujourd'hui, tu sais quoi faire."
      action={
        <Link
          href="/onboarding"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          Réajuster le cadre
        </Link>
      }
    >
      <section className="grid grid-cols-2 gap-3">
        <MetricCard label="Streak" value={`${profile?.streak ?? 0} jours`} delta="+1 rattrapage" />
        <MetricCard label="Calories loggées" value={`${mealCalories}`} delta={formatPercent(0.61)} />
      </section>

      <Card className="space-y-5 overflow-hidden bg-[linear-gradient(135deg,color-mix(in_oklab,oklch(var(--accent))_18%,white)_0%,white_100%)]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge tone="accent" className="gap-1.5">
              <Flame className="h-3.5 w-3.5" />
              Focus du jour
            </Badge>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
              {todayWorkout?.name ?? "Aucune séance prévue"}
            </h2>
            <p className="max-w-[32ch] text-sm leading-6 text-muted-foreground">
              {todayWorkout
                ? `${todayWorkout.durationMinutes} minutes prévues. Tout ce qui compte aujourd'hui: exécuter proprement et sortir avec une trace claire.`
                : "Ta journée reste active si tu valides au moins une action utile: repas, check-in ou séance."}
            </p>
          </div>
          <Badge tone="success">{todayWorkout?.dayLabel ?? "Libre"}</Badge>
        </div>

        <div className="grid gap-3">
          <Link
            href={todayWorkout ? `/training/session/${todayWorkout.id}` : "/training"}
            className="flex items-center justify-between rounded-3xl bg-white/80 px-4 py-4 text-sm font-semibold text-foreground"
          >
            Ouvrir la séance du jour
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/nutrition"
            className="flex items-center justify-between rounded-3xl bg-white/60 px-4 py-4 text-sm font-semibold text-foreground"
          >
            Ajouter un repas ou une collation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Card>

      <section className="space-y-4">
        <SectionHeading
          title="La semaine reste lisible"
          description="Les parcours critiques partent du cache local, puis la sync reprend dès que le réseau revient."
        />
        <div className="space-y-3">
          {workouts?.map((workout) => (
            <Card key={workout.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{workout.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatShortDate(workout.date)} · {workout.durationMinutes} min
                </p>
              </div>
              <Badge tone={workout.status === "completed" ? "success" : "default"}>
                {workout.status === "completed" ? "Fait" : workout.dayLabel}
              </Badge>
            </Card>
          ))}
        </div>
      </section>

      <ActionListCard
        title="Tâches utiles aujourd'hui"
        items={[
          "Compléter au moins 50% des exercices de ta séance pour garder la journée active.",
          "Vérifier ton dîner pour rester proche de ta cible protéines.",
          "Ajouter un check-in si la fatigue monte avant la fin de semaine."
        ]}
      />

      <section className="space-y-4">
        <SectionHeading
          title="Recommandations sous contrôle"
          description="Le Coach IA propose, explique et attend toujours ta validation avant de modifier quoi que ce soit."
        />
        <div className="space-y-3">
          {recommendations?.length ? (
            recommendations.map((recommendation) => (
              <StateCard
                key={recommendation.id}
                title={recommendation.suggestion}
                description={recommendation.justification}
                badge={{
                  label: recommendation.status === "accepted" ? "Acceptée" : "À valider",
                  tone: recommendation.status === "accepted" ? "success" : "accent"
                }}
                cta={{ label: recommendation.status === "accepted" ? "Voir l'impact" : "Examiner la suggestion" }}
              />
            ))
          ) : (
            <StateCard
              title="Aucune recommandation pour l'instant"
              description="C'est normal au démarrage. Les suggestions apparaîtront seulement quand il y aura assez de contexte sur tes séances, repas et check-ins."
              badge={{ label: "Empty", tone: "default" }}
              cta={{ label: "Ouvrir le Coach IA" }}
            />
          )}
        </div>
      </section>

      <Card className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Dernier poids enregistré</p>
          <p className="text-sm text-muted-foreground">{profile ? formatKg(profile.weightKg) : "Non renseigné"}</p>
        </div>
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-accent-strong" href="/progress">
          Voir la progression
          <NotebookTabs className="h-4 w-4" />
        </Link>
      </Card>
    </ScreenShell>
  );
}
