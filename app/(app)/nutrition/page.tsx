"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { MealComposerCard } from "@/components/cards/meal-composer-card";
import { MetricCard } from "@/components/cards/metric-card";
import { StateCard } from "@/components/cards/state-card";
import { ScreenShell } from "@/components/shell/screen-shell";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/offline/db";

export default function NutritionPage() {
  const meals = useLiveQuery(() => db.mealEntries.toArray(), []);

  const totals = meals?.reduce(
    (accumulator, meal) => {
      meal.items.forEach((item) => {
        accumulator.calories += item.calories;
        accumulator.protein += item.protein;
        accumulator.carbs += item.carbs;
        accumulator.fats += item.fats;
      });
      return accumulator;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <ScreenShell eyebrow="Nutrition" title="Journal du jour et macros sans friction">
      <section className="grid grid-cols-2 gap-3">
        <MetricCard label="Calories" value={String(Math.round(totals?.calories ?? 0))} delta="Cible visible" />
        <MetricCard label="Protéines" value={`${Math.round(totals?.protein ?? 0)} g`} delta="Priorité récup" />
      </section>

      <MealComposerCard />

      <section className="space-y-4">
        <SectionHeading
          title="Repas enregistrés"
          description="La proposition IA reste toujours éditable avant validation. Aucun enregistrement automatique."
        />
        <div className="space-y-3">
          {meals?.length ? (
            meals.map((meal) => (
              <Card key={meal.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{meal.mealName}</p>
                    <p className="text-xs text-muted-foreground">{meal.items.length} items</p>
                  </div>
                  <Badge tone={meal.source === "ai" ? "accent" : "default"}>
                    {meal.source === "ai" ? "IA corrigée" : "Manuel"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {meal.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-foreground">{item.label}</span>
                      <span className="text-muted-foreground">{item.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          ) : (
            <StateCard
              title="Aucun repas enregistré aujourd'hui"
              description="Commence par une saisie manuelle simple. La photo IA pourra venir ensuite si tu ajoutes ta clé OpenAI."
              badge={{ label: "Empty", tone: "default" }}
              cta={{ label: "Ajouter mon premier repas" }}
            />
          )}
        </div>
      </section>
    </ScreenShell>
  );
}
