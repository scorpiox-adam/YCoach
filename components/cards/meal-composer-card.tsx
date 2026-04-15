"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Camera, Search } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/offline/db";
import { enqueueSyncItem } from "@/lib/offline/sync-engine";

export function MealComposerCard() {
  const foods = useLiveQuery(() => db.foodItems.toArray(), []);
  const [search, setSearch] = useState("");
  const [mealName, setMealName] = useState("Collation");
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const filteredFoods = useMemo(() => {
    const value = deferredSearch.trim().toLowerCase();
    if (!foods) {
      return [];
    }

    if (!value) {
      return foods.slice(0, 5);
    }

    return foods.filter((item) => item.name.toLowerCase().includes(value)).slice(0, 5);
  }, [deferredSearch, foods]);

  async function handleAddMeal() {
    const food = foods?.find((item) => item.id === selectedFoodId);
    if (!food) {
      return;
    }

    const entryId = crypto.randomUUID();

    await db.mealEntries.put({
      id: entryId,
      mealName,
      date: new Date().toISOString(),
      source: "manual",
      confidence: 1,
      validated: true,
      items: [
        {
          id: crypto.randomUUID(),
          foodId: food.id,
          label: food.name,
          quantity: 1,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fats: food.fats
        }
      ]
    });

    await enqueueSyncItem({
      entity: "meal_entries",
      action: "create",
      payload: {
        entryId
      }
    });

    setSearch("");
    setSelectedFoodId(null);
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
          Ajouter un repas sans friction
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Recherche locale instantanée, ajout manuel prioritaire, photo IA en option.
        </p>
      </div>

      <Input value={mealName} onChange={(event) => setMealName(event.target.value)} placeholder="Nom du repas" />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-11"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cherche un aliment"
        />
      </div>

      <div className="space-y-2">
        {filteredFoods.map((food) => {
          const active = selectedFoodId === food.id;
          return (
            <button
              key={food.id}
              type="button"
              onClick={() => setSelectedFoodId(food.id)}
              className={`w-full rounded-2xl px-4 py-3 text-left ${active ? "bg-[color:color-mix(in_oklab,oklch(var(--accent))_14%,white)]" : "bg-white/65"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{food.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {food.calories} kcal · P {food.protein} · G {food.carbs} · L {food.fats}
                  </p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {food.portionGrams} g
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1 gap-2">
          <Camera className="h-4 w-4" />
          Estimer en photo
        </Button>
        <Button className="flex-1" onClick={handleAddMeal} disabled={!selectedFoodId}>
          Ajouter le repas
        </Button>
      </div>
    </Card>
  );
}
