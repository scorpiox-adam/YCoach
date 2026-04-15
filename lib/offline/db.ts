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

type LocalMeta = {
  key: string;
  value: string;
};

const activeUserMetaKey = "active-user-id";

function createEmptyProfile(identityKey: string, email?: string | null): UserProfile {
  const firstName = email?.split("@")[0] ?? "";

  return {
    ...mockProfile,
    id: identityKey,
    firstName,
    equipment: [],
    constraints: [],
    nutritionPreferences: [],
    weeklyAvailability: [],
    streak: 0,
    weightKg: 0,
    heightCm: 0,
    age: 0
  };
}

function createEmptySettings(identityKey: string): UserSettings {
  return {
    ...mockSettings,
    id: identityKey,
    aiAvailability: "missing_key",
    openAiKeyMasked: ""
  };
}

class YCoachDatabase extends Dexie {
  meta!: Table<LocalMeta, string>;
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
    this.version(2).stores({
      meta: "key",
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
  await db.transaction(
    "rw",
    [
      db.trainingTemplates,
      db.exercises,
      db.foodItems,
      db.reminders,
      db.trainingPlans
    ],
    async () => {
      if (await db.trainingTemplates.count() === 0) {
        await db.trainingTemplates.bulkPut(trainingTemplates);
      }

      if (await db.exercises.count() === 0) {
        await db.exercises.bulkPut(exercises);
      }

      if (await db.foodItems.count() === 0) {
        await db.foodItems.bulkPut(foodItems);
      }

      if (await db.reminders.count() === 0) {
        await db.reminders.bulkPut(reminders);
      }
    }
  );
}

async function clearVolatileUserScope() {
  await db.trainingPlans.clear();
  await db.plannedWorkouts.clear();
  await db.workoutSessions.clear();
  await db.mealEntries.clear();
  await db.progressCheckins.clear();
  await db.recommendations.clear();
  await db.weeklySummaries.clear();
  await db.syncQueue.clear();
}

async function migrateLegacyDemoScope(identityKey: string, email?: string | null) {
  const legacyProfile = await db.profile.get(mockProfile.id);
  const existingProfile = await db.profile.get(identityKey);

  if (!existingProfile) {
    await db.profile.put(
      legacyProfile
        ? {
            ...legacyProfile,
            id: identityKey
          }
        : createEmptyProfile(identityKey, email)
    );
  }

  if (identityKey !== mockProfile.id && legacyProfile) {
    await db.profile.delete(mockProfile.id);
  }

  const legacySettings = await db.settings.get(mockSettings.id);
  const existingSettings = await db.settings.get(identityKey);

  if (!existingSettings) {
    await db.settings.put(
      legacySettings
        ? {
            ...legacySettings,
            id: identityKey
          }
        : createEmptySettings(identityKey)
    );
  }

  if (identityKey !== mockSettings.id && legacySettings) {
    await db.settings.delete(mockSettings.id);
  }

  const legacyPlans = await db.trainingPlans.where("userId").equals(mockProfile.id).toArray();
  if (legacyPlans.length > 0) {
    await db.trainingPlans.bulkPut(
      legacyPlans.map((plan) => ({
        ...plan,
        userId: identityKey
      }))
    );
  }
}

export async function ensureLocalUserScope(identityKey: string, email?: string | null) {
  await db.transaction(
    "rw",
    [
      db.meta,
      db.profile,
      db.settings,
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
      const activeUser = await db.meta.get(activeUserMetaKey);
      const activeUserId = activeUser?.value ?? null;

      if (!activeUserId) {
        await migrateLegacyDemoScope(identityKey, email);
      }

      if (activeUserId && activeUserId !== identityKey) {
        await clearVolatileUserScope();
      }

      if (!(await db.profile.get(identityKey))) {
        await db.profile.put(createEmptyProfile(identityKey, email));
      }

      if (!(await db.settings.get(identityKey))) {
        await db.settings.put(createEmptySettings(identityKey));
      }

      await db.meta.put({
        key: activeUserMetaKey,
        value: identityKey
      });
    }
  );
}

export async function resetUserScopedData() {
  await db.transaction(
    "rw",
    [
      db.meta,
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
      await clearVolatileUserScope();
      await db.meta.delete(activeUserMetaKey);
    }
  );
}
