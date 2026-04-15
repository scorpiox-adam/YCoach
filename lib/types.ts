export type Goal = "weight_loss" | "muscle_gain" | "recomposition" | "performance";
export type Level = "beginner" | "intermediate" | "advanced";
export type SyncStatus = "queued" | "syncing" | "synced" | "failed";
export type RecommendationStatus = "proposed" | "accepted" | "refused";
export type MealSource = "manual" | "ai";
export type EntityOrigin = "standard" | "custom";
export type WorkoutStatus = "planned" | "in_progress" | "completed" | "skipped";
export type CheckinContext = "weekly" | "ad_hoc" | "recovery";
export type ReminderType = "workout" | "meal" | "weekly_review" | "coach";
export type AIAvailability = "ready" | "missing_key" | "invalid_key" | "offline" | "degraded";

export type UserProfile = {
  id: string;
  firstName: string;
  goal: Goal;
  level: Level;
  equipment: string[];
  constraints: string[];
  nutritionPreferences: string[];
  weeklyAvailability: string[];
  units: "metric";
  tone: "bienveillant_direct";
  weightKg: number;
  heightCm: number;
  age: number;
  streak: number;
};

export type UserSettings = {
  id: string;
  remindersEnabled: boolean;
  theme: "light";
  aiAvailability: AIAvailability;
  openAiKeyMasked: string;
};

export type Exercise = {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string;
  description: string;
  variants: string[];
  origin: EntityOrigin;
};

export type TrainingTemplate = {
  id: string;
  name: string;
  goal: Goal;
  level: Level | "all";
  frequency: number;
  sessions: PlannedWorkout[];
};

export type TrainingPlan = {
  id: string;
  userId: string;
  version: number;
  templateName: string;
  status: "active" | "archived";
  weeklyStructure: string[];
};

export type PlannedWorkout = {
  id: string;
  name: string;
  dayLabel: string;
  date: string;
  status: WorkoutStatus;
  exerciseIds: string[];
  durationMinutes: number;
};

export type SetLog = {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  loadKg: number;
  restSeconds: number;
  effort: number;
  completed: boolean;
};

export type WorkoutSession = {
  id: string;
  plannedWorkoutId: string;
  date: string;
  status: WorkoutStatus;
  notes: string;
  summary: string;
  sets: SetLog[];
};

export type NutritionTarget = {
  id: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  validFrom: string;
};

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portionGrams: number;
  origin: EntityOrigin;
};

export type MealEntryItem = {
  id: string;
  foodId: string;
  label: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type MealEntry = {
  id: string;
  mealName: string;
  date: string;
  source: MealSource;
  confidence: number;
  validated: boolean;
  items: MealEntryItem[];
};

export type RecoveryCheckin = {
  id: string;
  sleep: number;
  energy: number;
  fatigue: number;
  soreness: number;
  comment: string;
};

export type ProgressCheckin = {
  id: string;
  date: string;
  weightKg: number;
  note: string;
  photoCount: number;
  context: CheckinContext;
  recovery: RecoveryCheckin;
};

export type AIRecommendation = {
  id: string;
  context: string;
  suggestion: string;
  justification: string;
  expectedImpact: string;
  status: RecommendationStatus;
};

export type Reminder = {
  id: string;
  type: ReminderType;
  label: string;
  schedule: string;
  enabled: boolean;
};

export type WeeklySummary = {
  id: string;
  weekLabel: string;
  factualSummary: string[];
  suggestions: Array<{
    id: string;
    title: string;
    reason: string;
  }>;
};

export type SyncQueueItem = {
  id: string;
  entity: string;
  action: "create" | "update" | "delete" | "sync_ai";
  payload: Record<string, unknown>;
  attempts: number;
  lastAttemptAt: string | null;
  status: SyncStatus;
  clientMutationId: string;
};

