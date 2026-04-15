import type { Goal, NutritionTarget } from "@/lib/types";

const activityFactorMap = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725
} as const;

export function computeBmr({
  sex,
  weightKg,
  heightCm,
  age
}: {
  sex: "male" | "female";
  weightKg: number;
  heightCm: number;
  age: number;
}) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function computeNutritionTarget({
  goal,
  weightKg,
  heightCm,
  age,
  sex,
  activityBand,
  date
}: {
  goal: Goal;
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "male" | "female";
  activityBand: keyof typeof activityFactorMap;
  date: string;
}): NutritionTarget {
  const bmr = computeBmr({ sex, weightKg, heightCm, age });
  const tdee = Math.round(bmr * activityFactorMap[activityBand]);

  const variants = {
    weight_loss: {
      calories: tdee - 350,
      protein: 2 * weightKg,
      fatRatio: 0.25
    },
    muscle_gain: {
      calories: tdee + 250,
      protein: 2 * weightKg,
      fatRatio: 0.25
    },
    recomposition: {
      calories: tdee,
      protein: 2.3 * weightKg,
      fatRatio: 0.3
    },
    performance: {
      calories: tdee + 150,
      protein: 1.8 * weightKg,
      fatRatio: 0.2
    }
  };

  const variant = variants[goal];
  const fats = Math.round((variant.calories * variant.fatRatio) / 9);
  const protein = Math.round(variant.protein);
  const carbs = Math.max(0, Math.round((variant.calories - protein * 4 - fats * 9) / 4));

  return {
    id: "target-initial",
    calories: variant.calories,
    proteinGrams: protein,
    carbsGrams: carbs,
    fatsGrams: fats,
    validFrom: date
  };
}

