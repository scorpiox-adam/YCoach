import Dexie, { type Table } from "dexie";

import {
  exercises,
  foodItems,
  mockProfile,
  mockSettings,
  reminders,
  trainingTemplates,
} from "@/lib/mock-data";
import type {
  AIRecommendation,
  Exercise,
  FoodItem,
  MealEntry,
  PlannedWorkout,
  ProgressCheckin,
  Reminder,
  SyncQueueItem,
  TrainingPlan,
  TrainingTemplate,
  UserProfile,
  UserSettings,
  WeeklySummary,
  WorkoutSession
} from "@/lib/types";

class YCoachDatabase extends Dexie {
  profile!: Table<UserProfile, string>;
  settings!: Table<UserSettings, string>;
  trainingPlans!: Table<TrainingPlan, string>;
  trainingTemplates!: Table<TrainingTemplate, string>;
  plannedWorkouts!: Table<PlannedWorkout, string>;
  workoutSessions!: Table<WorkoutSession, string>;
  exercises!: Table<Exercise, string>;
  foodItems!: Table<FoodItem, string>;
  mealEntries!: Table<MealEntry, string>;
  progressCheckins!: Table<ProgressCheckin, string>;
  recommendations!: Table<AIRecommendation, string>;
  reminders!: Table<Reminder, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  weeklySummaries!: Table<WeeklySummary, string>;

  constructor() {
    super("ycoach-db");
    this.version(1).stores({
      profile: "id",
      settings: "id",
      trainingPlans: "id, userId, status",
      trainingTemplates: "id, goal, level",
      plannedWorkouts: "id, date, status",
      workoutSessions: "id, date, status, plannedWorkoutId",
      exercises: "id, category, muscleGroup, origin",
      foodItems: "id, name, origin",
      mealEntries: "id, date, source, validated",
      progressCheckins: "id, date, context",
      recommendations: "id, status, context",
      reminders: "id, type, enabled",
      syncQueue: "id, status, lastAttemptAt",
      weeklySummaries: "id, weekLabel"
    });
  }
}

export const db = new YCoachDatabase();

export async function primeLocalCache() {
  const hasProfile = await db.profile.count();
  if (hasProfile > 0) {
    return;
  }

  await db.transaction(
    "rw",
    [
      db.profile,
      db.settings,
      db.trainingTemplates,
      db.exercises,
      db.foodItems,
      db.reminders,
      db.trainingPlans
    ],
    async () => {
      await db.profile.put({
        ...mockProfile,
        firstName: "",
        equipment: [],
        constraints: [],
        nutritionPreferences: [],
        weeklyAvailability: [],
        streak: 0,
        weightKg: 0,
        heightCm: 0,
        age: 0
      });
      await db.settings.put(mockSettings);
      await db.trainingTemplates.bulkPut(trainingTemplates);
      await db.exercises.bulkPut(exercises);
      await db.foodItems.bulkPut(foodItems);
      await db.reminders.bulkPut(reminders);
    }
  );
}

export async function resetUserScopedData() {
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
      await db.profile.put({
        ...mockProfile,
        firstName: "",
        equipment: [],
        constraints: [],
        nutritionPreferences: [],
        weeklyAvailability: [],
        streak: 0,
        weightKg: 0,
        heightCm: 0,
        age: 0
      });
    }
  );
}
