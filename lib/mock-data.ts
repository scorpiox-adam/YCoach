import { computeNutritionTarget } from "@/lib/formulas";
import type {
  AIRecommendation,
  Exercise,
  FoodItem,
  MealEntry,
  PlannedWorkout,
  ProgressCheckin,
  Reminder,
  TrainingPlan,
  TrainingTemplate,
  UserProfile,
  UserSettings,
  WeeklySummary,
  WorkoutSession
} from "@/lib/types";

const today = new Date();

function dayOffset(offset: number) {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

export const mockProfile: UserProfile = {
  id: "user-demo",
  firstName: "Adam",
  goal: "recomposition",
  level: "intermediate",
  equipment: ["haltères", "barre olympique", "banc", "barre de traction"],
  constraints: ["Épaule droite sensible en développé militaire lourd"],
  nutritionPreferences: ["Petit-déjeuner salé", "2 cafés maximum", "Collation post-entraînement"],
  weeklyAvailability: ["Lun", "Mar", "Jeu", "Sam"],
  units: "metric",
  tone: "bienveillant_direct",
  weightKg: 78.2,
  heightCm: 180,
  age: 31,
  streak: 12
};

export const mockSettings: UserSettings = {
  id: "settings-demo",
  remindersEnabled: true,
  theme: "light",
  aiAvailability: "missing_key",
  openAiKeyMasked: ""
};

export const nutritionTarget = computeNutritionTarget({
  goal: mockProfile.goal,
  weightKg: mockProfile.weightKg,
  heightCm: mockProfile.heightCm,
  age: mockProfile.age,
  sex: "male",
  activityBand: 3,
  date: today.toISOString()
});

export const exercises: Exercise[] = [
  {
    id: "ex-squat",
    name: "Squat barre",
    category: "Force",
    muscleGroup: "Quadriceps",
    secondaryMuscles: ["Fessiers", "Abdominaux"],
    equipment: "barre olympique",
    description: "Descends contrôlé, remonte fort en gardant le tronc gainé.",
    variants: ["Front squat", "Goblet squat"],
    origin: "standard"
  },
  {
    id: "ex-bench",
    name: "Développé couché",
    category: "Force",
    muscleGroup: "Pectoraux",
    secondaryMuscles: ["Triceps", "Épaules"],
    equipment: "barre olympique",
    description: "Toucher léger poitrine, trajectoire stable, pieds ancrés.",
    variants: ["Développé haltères", "Pompes lestées"],
    origin: "standard"
  },
  {
    id: "ex-row",
    name: "Rowing unilatéral",
    category: "Force",
    muscleGroup: "Dos",
    secondaryMuscles: ["Biceps", "Avant-bras"],
    equipment: "haltères",
    description: "Tire le coude vers la hanche, stabilise le buste.",
    variants: ["Rowing poitrine appuyée", "Rowing barre"],
    origin: "standard"
  },
  {
    id: "ex-rdl",
    name: "Soulevé de terre roumain",
    category: "Force",
    muscleGroup: "Ischio-jambiers",
    secondaryMuscles: ["Fessiers", "Dos"],
    equipment: "barre olympique",
    description: "Hanches en arrière, dos long, amplitude contrôlée.",
    variants: ["RDL haltères", "Good morning"],
    origin: "standard"
  },
  {
    id: "ex-bike",
    name: "Vélo zone 2",
    category: "Cardio",
    muscleGroup: "Corps entier",
    secondaryMuscles: [],
    equipment: "vélo",
    description: "Effort conversationnel stable pendant 30 à 45 minutes.",
    variants: ["Rameur zone 2", "Course facile"],
    origin: "standard"
  },
  {
    id: "ex-custom-landmine",
    name: "Presse landmine",
    category: "Force",
    muscleGroup: "Épaules",
    secondaryMuscles: ["Triceps", "Abdominaux"],
    equipment: "barre olympique",
    description: "Option personnalisée plus confortable pour l'épaule.",
    variants: ["Presse unilatérale debout"],
    origin: "custom"
  }
];

export const plannedWorkouts: PlannedWorkout[] = [
  {
    id: "pw-1",
    name: "Lower force",
    dayLabel: "Aujourd'hui",
    date: dayOffset(0),
    status: "planned",
    exerciseIds: ["ex-squat", "ex-rdl", "ex-bike"],
    durationMinutes: 70
  },
  {
    id: "pw-2",
    name: "Upper push-pull",
    dayLabel: "Jeudi",
    date: dayOffset(2),
    status: "planned",
    exerciseIds: ["ex-bench", "ex-row", "ex-custom-landmine"],
    durationMinutes: 65
  },
  {
    id: "pw-3",
    name: "Conditioning",
    dayLabel: "Samedi",
    date: dayOffset(4),
    status: "planned",
    exerciseIds: ["ex-bike"],
    durationMinutes: 40
  }
];

export const trainingPlan: TrainingPlan = {
  id: "plan-active",
  userId: mockProfile.id,
  version: 3,
  templateName: "Upper Lower",
  status: "active",
  weeklyStructure: ["Lun Lower", "Mar Repos", "Jeu Upper", "Sam Conditioning"]
};

export const trainingTemplates: TrainingTemplate[] = [
  {
    id: "tpl-full-body",
    name: "Full Body Fondation",
    goal: "muscle_gain",
    level: "beginner",
    frequency: 3,
    sessions: plannedWorkouts
  },
  {
    id: "tpl-upper-lower",
    name: "Upper Lower",
    goal: "recomposition",
    level: "intermediate",
    frequency: 4,
    sessions: plannedWorkouts
  },
  {
    id: "tpl-cardio",
    name: "Cardio Endurance",
    goal: "performance",
    level: "all",
    frequency: 4,
    sessions: plannedWorkouts
  }
];

export const workoutSessions: WorkoutSession[] = [
  {
    id: "session-1",
    plannedWorkoutId: "pw-1",
    date: dayOffset(-2),
    status: "completed",
    notes: "Très bonnes sensations sur les jambes, repos un peu court sur le dernier bloc.",
    summary: "Volume validé, charge stable, cardio facile en fin.",
    sets: [
      { id: "set-1", exerciseId: "ex-squat", setNumber: 1, reps: 6, loadKg: 92.5, restSeconds: 150, effort: 7, completed: true },
      { id: "set-2", exerciseId: "ex-squat", setNumber: 2, reps: 6, loadKg: 92.5, restSeconds: 150, effort: 8, completed: true },
      { id: "set-3", exerciseId: "ex-rdl", setNumber: 1, reps: 8, loadKg: 80, restSeconds: 120, effort: 7, completed: true }
    ]
  }
];

export const foodItems: FoodItem[] = [
  { id: "food-skyr", name: "Skyr nature", calories: 64, protein: 11, carbs: 3.6, fats: 0.2, portionGrams: 150, origin: "standard" },
  { id: "food-oats", name: "Flocons d'avoine", calories: 372, protein: 13, carbs: 58, fats: 7, portionGrams: 50, origin: "standard" },
  { id: "food-banana", name: "Banane", calories: 89, protein: 1.1, carbs: 20, fats: 0.3, portionGrams: 120, origin: "standard" },
  { id: "food-rice", name: "Riz basmati cuit", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, portionGrams: 180, origin: "standard" },
  { id: "food-chicken", name: "Poulet grillé", calories: 165, protein: 31, carbs: 0, fats: 3.6, portionGrams: 150, origin: "standard" },
  { id: "food-olive-oil", name: "Huile d'olive", calories: 884, protein: 0, carbs: 0, fats: 100, portionGrams: 10, origin: "standard" },
  { id: "food-yogurt-bowl", name: "Bol yaourt maison", calories: 146, protein: 8, carbs: 18, fats: 3, portionGrams: 220, origin: "custom" }
];

export const mealEntries: MealEntry[] = [
  {
    id: "meal-1",
    mealName: "Petit-déjeuner",
    date: dayOffset(0),
    source: "manual",
    confidence: 1,
    validated: true,
    items: [
      { id: "meal-item-1", foodId: "food-skyr", label: "Skyr nature", quantity: 1, calories: 96, protein: 16.5, carbs: 5.4, fats: 0.3 },
      { id: "meal-item-2", foodId: "food-oats", label: "Flocons d'avoine", quantity: 1, calories: 186, protein: 6.5, carbs: 29, fats: 3.5 }
    ]
  },
  {
    id: "meal-2",
    mealName: "Déjeuner",
    date: dayOffset(0),
    source: "ai",
    confidence: 0.82,
    validated: true,
    items: [
      { id: "meal-item-3", foodId: "food-rice", label: "Riz basmati", quantity: 1, calories: 234, protein: 4.9, carbs: 50.4, fats: 0.5 },
      { id: "meal-item-4", foodId: "food-chicken", label: "Poulet grillé", quantity: 1, calories: 248, protein: 46.5, carbs: 0, fats: 5.4 }
    ]
  }
];

export const progressCheckins: ProgressCheckin[] = [
  {
    id: "checkin-1",
    date: dayOffset(-7),
    weightKg: 78.9,
    note: "Semaine régulière, digestion meilleure que la précédente.",
    photoCount: 2,
    context: "weekly",
    recovery: {
      id: "recovery-1",
      sleep: 4,
      energy: 4,
      fatigue: 2,
      soreness: 3,
      comment: "Jambes lourdes après le lower, rien d'alarmant."
    }
  },
  {
    id: "checkin-2",
    date: dayOffset(0),
    weightKg: 78.2,
    note: "Poids stable mais meilleures perfs sur squat.",
    photoCount: 2,
    context: "weekly",
    recovery: {
      id: "recovery-2",
      sleep: 3,
      energy: 4,
      fatigue: 3,
      soreness: 2,
      comment: "Un peu court en sommeil mardi, récup correcte ensuite."
    }
  }
];

export const recommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    context: "Nutrition",
    suggestion: "Remonte légèrement tes protéines au dîner aujourd'hui pour retomber dans la zone cible.",
    justification: "Tu es sous ta cible protéines de 28 g à mi-journée alors que la séance du bas du corps est prévue ce soir.",
    expectedImpact: "Mieux soutenir la récupération sans alourdir la journée.",
    status: "proposed"
  },
  {
    id: "rec-2",
    context: "Entraînement",
    suggestion: "Reste à 92,5 kg sur le squat cette semaine et cherche une rep propre de plus avant de charger.",
    justification: "Le volume est validé mais le RPE monte vite sur les dernières séries.",
    expectedImpact: "Conserver une progression stable sans sur-fatigue.",
    status: "accepted"
  }
];

export const reminders: Reminder[] = [
  { id: "rem-1", type: "workout", label: "Séance du jour", schedule: "18:00", enabled: true },
  { id: "rem-2", type: "meal", label: "Point macros", schedule: "13:00", enabled: true },
  { id: "rem-3", type: "weekly_review", label: "Bilan hebdo", schedule: "Dimanche 20:00", enabled: true }
];

export const weeklySummary: WeeklySummary = {
  id: "ws-1",
  weekLabel: "Semaine du 8 au 14 avril",
  factualSummary: [
    "3 séances réalisées sur 4 prévues, avec une bonne constance sur le bas du corps.",
    "Moyenne protéines: 154 g/j, légèrement sous l'objectif sur deux journées.",
    "Poids stable à la baisse légère, récupération perçue correcte."
  ],
  suggestions: [
    {
      id: "sug-1",
      title: "Verrouille un dîner protéiné après les séances jambes",
      reason: "Tu récupères mieux quand le repas post-séance reste simple et répétable."
    },
    {
      id: "sug-2",
      title: "Garde la même charge squat une semaine de plus",
      reason: "La qualité d'exécution progresse encore à charge constante."
    }
  ]
};

