"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  getAuthIdentityKey,
  getClientAuthState,
  setOnboardingComplete
} from "@/lib/auth/client-auth";
import { computeNutritionTarget } from "@/lib/formulas";
import { db, ensureLocalUserScope } from "@/lib/offline/db";
import { enqueueSyncItem } from "@/lib/offline/sync-engine";
import type { Goal, Level } from "@/lib/types";

const steps = [
  "Objectif et niveau",
  "Fréquence et matériel",
  "Mensurations",
  "Habitudes nutrition",
  "Contraintes"
] as const;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>("recomposition");
  const [level, setLevel] = useState<Level>("intermediate");
  const [frequency, setFrequency] = useState("4");
  const [equipment, setEquipment] = useState("haltères, barre olympique, banc");
  const [weight, setWeight] = useState("78");
  const [height, setHeight] = useState("180");
  const [age, setAge] = useState("31");
  const [habits, setHabits] = useState("3 repas, collation post-training, café le matin");
  const [constraints, setConstraints] = useState("Épaule sensible sur certains angles");
  const [feedback, setFeedback] = useState<string | null>(null);
  const currentStepLabel = steps[step] ?? steps[0];

  const nutritionTarget = computeNutritionTarget({
    goal,
    weightKg: Number(weight),
    heightCm: Number(height),
    age: Number(age),
    sex: "male",
    activityBand: Number(frequency) >= 4 ? 3 : 2,
    date: new Date().toISOString()
  });

  async function handleFinish() {
    setFeedback("Génération de ton cadre initial...");

    startTransition(() => {
      void (async () => {
        const authState = await getClientAuthState();
        const identityKey = getAuthIdentityKey(authState);

        if (!identityKey) {
          setFeedback("La session n'est plus disponible. Reconnecte-toi pour terminer l'onboarding.");
          return;
        }

        await ensureLocalUserScope(identityKey, authState.email);

        const templates = await db.trainingTemplates.toArray();
        const selectedTemplate =
          templates.find((template) => template.goal === goal && (template.level === level || template.level === "all")) ??
          templates[0];

        const generatedPlanId = crypto.randomUUID();
        const generatedStart = new Date();

        await db.transaction(
          "rw",
          [
            db.profile,
            db.trainingPlans,
            db.plannedWorkouts,
            db.workoutSessions,
            db.mealEntries,
            db.progressCheckins,
            db.recommendations,
            db.weeklySummaries,
            db.syncQueue
          ],
          async () => {
            await db.trainingPlans.clear();
            await db.plannedWorkouts.clear();
            await db.workoutSessions.clear();
            await db.mealEntries.clear();
            await db.progressCheckins.clear();
            await db.recommendations.clear();
            await db.weeklySummaries.clear();
            await db.syncQueue.clear();

            await db.profile.update(identityKey, {
              firstName: emailLikeName(),
              goal,
              level,
              streak: 0,
              equipment: equipment.split(",").map((item) => item.trim()).filter(Boolean),
              constraints: constraints ? [constraints] : [],
              nutritionPreferences: habits.split(",").map((item) => item.trim()).filter(Boolean),
              weeklyAvailability: [`${frequency} séances / semaine`],
              weightKg: Number(weight),
              heightCm: Number(height),
              age: Number(age)
            });

            await db.trainingPlans.put({
              id: generatedPlanId,
              userId: identityKey,
              version: 1,
              templateName: selectedTemplate?.name ?? "Cadre initial",
              status: "active",
              weeklyStructure:
                selectedTemplate?.sessions.map((session) => session.name) ?? [
                  "Jour 1",
                  "Jour 2",
                  "Jour 3"
                ]
            });

            await db.plannedWorkouts.bulkPut(
              (selectedTemplate?.sessions ?? []).map((session, index) => {
                const date = new Date(generatedStart);
                date.setDate(generatedStart.getDate() + index);

                return {
                  ...session,
                  id: crypto.randomUUID(),
                  date: date.toISOString(),
                  dayLabel: index === 0 ? "Aujourd'hui" : `Jour ${index + 1}`,
                  status: "planned" as const
                };
              })
            );
          }
        );

        await enqueueSyncItem({
          entity: "user_profiles",
          action: "update",
          payload: {
            goal,
            level,
            frequency,
            equipment,
            weight,
            height,
            age,
            habits,
            constraints
          }
        });

        setOnboardingComplete(true, identityKey);
        router.push("/agenda");
      })();
    });
  }

  function emailLikeName() {
    return "Toi";
  }

  return (
    <div className="space-y-6">
      <ProgressBar value={((step + 1) / steps.length) * 100} />

      <Card className="space-y-6">
        <SectionHeading
          title={currentStepLabel}
          description="On garde le flux court et utile. Tout ce qui n'est pas indispensable pourra être affiné plus tard."
        />

        {step === 0 ? (
          <div className="space-y-4">
            <div>
              <Label>Objectif principal</Label>
              <SegmentedControl
                value={goal}
                onChange={setGoal}
                options={[
                  { label: "Perte", value: "weight_loss" },
                  { label: "Muscle", value: "muscle_gain" },
                  { label: "Recomp", value: "recomposition" },
                  { label: "Perf", value: "performance" }
                ]}
              />
            </div>
            <div>
              <Label>Niveau perçu</Label>
              <SegmentedControl
                value={level}
                onChange={setLevel}
                options={[
                  { label: "Débutant", value: "beginner" },
                  { label: "Intermédiaire", value: "intermediate" },
                  { label: "Avancé", value: "advanced" }
                ]}
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="frequency">Fréquence visée</Label>
              <Input
                id="frequency"
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
                placeholder="4"
              />
            </div>
            <div>
              <Label htmlFor="equipment">Matériel disponible</Label>
              <Input
                id="equipment"
                value={equipment}
                onChange={(event) => setEquipment(event.target.value)}
                placeholder="haltères, barre olympique, banc"
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="weight">Poids</Label>
              <Input id="weight" value={weight} onChange={(event) => setWeight(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="height">Taille</Label>
              <Input id="height" value={height} onChange={(event) => setHeight(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="age">Âge</Label>
              <Input id="age" value={age} onChange={(event) => setAge(event.target.value)} />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <Label htmlFor="habits">Habitudes et préférences</Label>
            <Input id="habits" value={habits} onChange={(event) => setHabits(event.target.value)} />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="constraints">Contraintes physiques éventuelles</Label>
              <Input
                id="constraints"
                value={constraints}
                onChange={(event) => setConstraints(event.target.value)}
                placeholder="Optionnel"
              />
            </div>
            <div className="rounded-3xl bg-white/65 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Cadre généré
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                Programme initial {goal === "performance" ? "orienté performance" : "centré progression"} avec environ {frequency} séances/semaine.
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Cibles nutrition: {nutritionTarget.calories} kcal, {nutritionTarget.proteinGrams} g protéines, {nutritionTarget.carbsGrams} g glucides, {nutritionTarget.fatsGrams} g lipides.
              </p>
            </div>
          </div>
        ) : null}

        {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}

        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
            Revenir
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>
              Continuer
            </Button>
          ) : (
            <Button onClick={handleFinish}>Générer mon cadre initial</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
