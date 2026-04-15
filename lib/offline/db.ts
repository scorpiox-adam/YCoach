import Dexie, { type Table } from "dexie";

import {
  exercises,
  foodItems,
  mealEntries,
  mockProfile,
  mockSettings,
  nutritionTarget,
  plannedWorkouts,
  progressCheckins,
  recommendations,
  reminders,
  trainingPlan,
  trainingTemplates,
  weeklySummary,
  workoutSessions
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
      db.trainingPlans,
      db.trainingTemplates,
      db.plannedWorkouts,
      db.workoutSessions,
      db.exercises,
      db.foodItems,
      db.mealEntries,
      db.progressCheckins,
      db.recommendations,
      db.reminders,
      db.syncQueue,
      db.weeklySummaries
    ],
    async () => {
      await db.profile.put(mockProfile);
      await db.settings.put(mockSettings);
      await db.trainingPlans.put(trainingPlan);
      await db.trainingTemplates.bulkPut(trainingTemplates);
      await db.plannedWorkouts.bulkPut(plannedWorkouts);
      await db.workoutSessions.bulkPut(workoutSessions);
      await db.exercises.bulkPut(exercises);
      await db.foodItems.bulkPut(foodItems);
      await db.mealEntries.bulkPut(mealEntries);
      await db.progressCheckins.bulkPut(progressCheckins);
      await db.recommendations.bulkPut(recommendations);
      await db.reminders.bulkPut(reminders);
      await db.weeklySummaries.put(weeklySummary);
      await db.syncQueue.bulkPut([
        {
          id: "sync-1",
          entity: "meal_entries",
          action: "create",
          payload: {
            targetCalories: nutritionTarget.calories,
            note: "Exemple d'élément en attente"
          },
          attempts: 0,
          lastAttemptAt: null,
          status: "queued",
          clientMutationId: "demo-sync-1"
        }
      ]);
    }
  );
}
