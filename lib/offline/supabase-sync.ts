import type { SupabaseClient } from "@supabase/supabase-js";

import { getAuthIdentityKey, getClientAuthState } from "@/lib/auth/client-auth";
import { db, ensureLocalUserScope } from "@/lib/offline/db";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  AIAvailability,
  CheckinContext,
  Goal,
  Level,
  MealEntry,
  PlannedWorkout,
  ProgressCheckin,
  Reminder,
  SetLog,
  SyncQueueItem,
  TrainingPlan,
  UserProfile,
  UserSettings,
  WorkoutSession,
  WorkoutStatus
} from "@/lib/types";

type BrowserSupabaseClient = SupabaseClient;

type SyncContext = {
  email: string | null;
  identityKey: string;
  supabase: BrowserSupabaseClient;
  userId: string;
};

type RemoteProfileRow = {
  age: number | null;
  constraints: string[] | null;
  equipment: string[] | null;
  first_name: string | null;
  goal: Goal;
  height_cm: number | null;
  id: string;
  level: Level;
  nutrition_preferences: string[] | null;
  streak_count: number | null;
  tone: string | null;
  units: string | null;
  weekly_availability: string[] | null;
  weight_kg: number | string | null;
};

type RemoteSettingsRow = {
  ai_availability: AIAvailability;
  reminders_enabled: boolean;
  theme: string | null;
  user_id: string;
};

type RemoteTrainingPlanRow = {
  id: string;
  name: string;
  status: string;
  user_id: string;
  version: number;
  weekly_structure: unknown;
};

type RemotePlannedWorkoutExerciseRow = {
  exercise_id: string;
  sort_order: number;
};

type RemotePlannedWorkoutRow = {
  day_label: string;
  duration_minutes: number;
  id: string;
  name: string;
  planned_workout_exercises: RemotePlannedWorkoutExerciseRow[] | null;
  scheduled_for: string;
  status: WorkoutStatus;
  training_plan_id: string;
};

type RemoteSetLogRow = {
  completed: boolean;
  effort: number | null;
  exercise_id: string;
  id: string;
  load_kg: number | string | null;
  reps: number | null;
  rest_seconds: number | null;
  set_number: number;
};

type RemoteWorkoutSessionRow = {
  id: string;
  notes: string | null;
  performed_at: string;
  planned_workout_id: string | null;
  set_logs: RemoteSetLogRow[] | null;
  status: WorkoutStatus;
  summary: string | null;
};

type RemoteMealEntryItemRow = {
  calories: number;
  carbs: number | string;
  fats: number | string;
  food_item_id: string | null;
  id: string;
  label: string;
  protein: number | string;
  quantity: number | string;
};

type RemoteMealEntryRow = {
  confidence: number | string;
  eaten_at: string;
  id: string;
  meal_entry_items: RemoteMealEntryItemRow[] | null;
  meal_name: string;
  source: MealEntry["source"];
  user_validated: boolean;
};

type RemoteRecoveryCheckinRow = {
  comment: string | null;
  energy: number;
  fatigue: number;
  id: string;
  sleep: number;
  soreness: number;
};

type RemoteProgressCheckinRow = {
  context: CheckinContext;
  happened_at: string;
  id: string;
  note: string | null;
  recovery_checkin_id: string | null;
  weight_kg: number | string | null;
};

type RemoteReminderRow = {
  enabled: boolean;
  id: string;
  label: string;
  schedule: string;
  type: Reminder["type"];
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toNumber(value: number | string | null | undefined, fallback = 0) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function toScheduledDate(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function assertUuidList(entityLabel: string, ids: string[]) {
  const invalidIds = ids.filter((id) => !isUuid(id));

  if (invalidIds.length > 0) {
    throw new Error(
      `Sync ${entityLabel} impossible: ${invalidIds.length} identifiant(s) local(aux) n'existent pas encore dans Supabase.`
    );
  }
}

function mapProfileRow(row: RemoteProfileRow): UserProfile {
  return {
    id: row.id,
    firstName: row.first_name ?? "",
    goal: row.goal,
    level: row.level,
    equipment: row.equipment ?? [],
    constraints: row.constraints ?? [],
    nutritionPreferences: row.nutrition_preferences ?? [],
    weeklyAvailability: row.weekly_availability ?? [],
    units: "metric",
    tone: "bienveillant_direct",
    weightKg: toNumber(row.weight_kg),
    heightCm: row.height_cm ?? 0,
    age: row.age ?? 0,
    streak: row.streak_count ?? 0
  };
}

function mapSettingsRow(row: RemoteSettingsRow): UserSettings {
  return {
    id: row.user_id,
    remindersEnabled: row.reminders_enabled,
    theme: "light",
    aiAvailability: row.ai_availability,
    openAiKeyMasked: ""
  };
}

function mapTrainingPlanRow(row: RemoteTrainingPlanRow): TrainingPlan {
  return {
    id: row.id,
    userId: row.user_id,
    templateName: row.name,
    version: row.version,
    status: row.status === "archived" ? "archived" : "active",
    weeklyStructure: toStringArray(row.weekly_structure)
  };
}

function mapPlannedWorkoutRow(row: RemotePlannedWorkoutRow): PlannedWorkout {
  const exerciseIds =
    row.planned_workout_exercises
      ?.slice()
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((exercise) => exercise.exercise_id) ?? [];

  return {
    id: row.id,
    name: row.name,
    dayLabel: row.day_label,
    date: new Date(row.scheduled_for).toISOString(),
    status: row.status,
    exerciseIds,
    durationMinutes: row.duration_minutes
  };
}

function mapSetLogRow(row: RemoteSetLogRow): SetLog {
  return {
    id: row.id,
    exerciseId: row.exercise_id,
    setNumber: row.set_number,
    reps: row.reps ?? 0,
    loadKg: toNumber(row.load_kg),
    restSeconds: row.rest_seconds ?? 0,
    effort: row.effort ?? 0,
    completed: row.completed
  };
}

function mapWorkoutSessionRow(row: RemoteWorkoutSessionRow): WorkoutSession {
  return {
    id: row.id,
    plannedWorkoutId: row.planned_workout_id ?? "",
    date: row.performed_at,
    status: row.status,
    notes: row.notes ?? "",
    summary: row.summary ?? "",
    sets:
      row.set_logs
        ?.slice()
        .sort((left, right) => left.set_number - right.set_number)
        .map(mapSetLogRow) ?? []
  };
}

function mapMealEntryRow(row: RemoteMealEntryRow): MealEntry {
  return {
    id: row.id,
    mealName: row.meal_name,
    date: row.eaten_at,
    source: row.source,
    confidence: toNumber(row.confidence, 1),
    validated: row.user_validated,
    items:
      row.meal_entry_items?.map((item) => ({
        id: item.id,
        foodId: item.food_item_id ?? "",
        label: item.label,
        quantity: toNumber(item.quantity, 1),
        calories: item.calories,
        protein: toNumber(item.protein),
        carbs: toNumber(item.carbs),
        fats: toNumber(item.fats)
      })) ?? []
  };
}

function mapProgressCheckinRow(
  row: RemoteProgressCheckinRow,
  recoveryById: Map<string, RemoteRecoveryCheckinRow>
): ProgressCheckin {
  const recovery = row.recovery_checkin_id ? recoveryById.get(row.recovery_checkin_id) : null;

  return {
    id: row.id,
    date: row.happened_at,
    weightKg: toNumber(row.weight_kg),
    note: row.note ?? "",
    photoCount: 0,
    context: row.context,
    recovery: {
      id: recovery?.id ?? crypto.randomUUID(),
      sleep: recovery?.sleep ?? 0,
      energy: recovery?.energy ?? 0,
      fatigue: recovery?.fatigue ?? 0,
      soreness: recovery?.soreness ?? 0,
      comment: recovery?.comment ?? ""
    }
  };
}

function mapReminderRow(row: RemoteReminderRow): Reminder {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    schedule: row.schedule,
    enabled: row.enabled
  };
}

export function isUuid(value: string | null | undefined): value is string {
  return typeof value === "string" && uuidPattern.test(value);
}

export async function getSyncContext(): Promise<SyncContext | null> {
  const supabase = createSupabaseBrowserClient();

  if (!supabase) {
    return null;
  }

  const authState = await getClientAuthState();
  const identityKey = getAuthIdentityKey(authState);

  if (!authState.isAuthenticated || authState.provider !== "supabase" || !authState.userId || !identityKey) {
    return null;
  }

  await ensureLocalUserScope(identityKey, authState.email);

  return {
    email: authState.email,
    identityKey,
    supabase,
    userId: authState.userId
  };
}

async function syncUserProfile(context: SyncContext) {
  const profile = await db.profile.get(context.identityKey);

  if (!profile) {
    return;
  }

  const { error } = await context.supabase.from("user_profiles").upsert(
    {
      id: context.userId,
      first_name: profile.firstName,
      goal: profile.goal,
      level: profile.level,
      equipment: profile.equipment,
      constraints: profile.constraints,
      nutrition_preferences: profile.nutritionPreferences,
      weekly_availability: profile.weeklyAvailability,
      units: profile.units,
      tone: profile.tone,
      weight_kg: profile.weightKg,
      height_cm: profile.heightCm,
      age: profile.age,
      streak_count: profile.streak
    },
    {
      onConflict: "id"
    }
  );

  if (error) {
    throw error;
  }
}

async function syncUserSettings(context: SyncContext) {
  const settings = await db.settings.get(context.identityKey);

  if (!settings) {
    return;
  }

  const { error } = await context.supabase.from("user_settings").upsert(
    {
      user_id: context.userId,
      reminders_enabled: settings.remindersEnabled,
      theme: settings.theme,
      ai_availability: settings.aiAvailability
    },
    {
      onConflict: "user_id"
    }
  );

  if (error) {
    throw error;
  }
}

async function syncTrainingPlans(context: SyncContext) {
  const localPlans = await db.trainingPlans.where("userId").equals(context.identityKey).toArray();
  const localIds = new Set(localPlans.map((plan) => plan.id));

  const { data: remotePlans, error: fetchError } = await context.supabase
    .from("training_plans")
    .select("id")
    .eq("user_id", context.userId);

  if (fetchError) {
    throw fetchError;
  }

  const idsToDelete =
    (remotePlans ?? [])
      .map((plan) => plan.id)
      .filter((planId) => !localIds.has(planId));

  if (idsToDelete.length > 0) {
    const { error } = await context.supabase.from("training_plans").delete().in("id", idsToDelete);

    if (error) {
      throw error;
    }
  }

  if (localPlans.length === 0) {
    return;
  }

  const { error } = await context.supabase.from("training_plans").upsert(
    localPlans.map((plan) => ({
      id: plan.id,
      user_id: context.userId,
      name: plan.templateName,
      version: plan.version,
      status: plan.status,
      weekly_structure: plan.weeklyStructure
    })),
    {
      onConflict: "id"
    }
  );

  if (error) {
    throw error;
  }
}

async function syncPlannedWorkouts(context: SyncContext) {
  const localPlans = await db.trainingPlans.where("userId").equals(context.identityKey).toArray();
  const activePlan = localPlans.find((plan) => plan.status === "active") ?? localPlans[0];
  const localWorkouts = await db.plannedWorkouts.orderBy("date").toArray();
  const localIds = new Set(localWorkouts.map((workout) => workout.id));

  if (!activePlan && localWorkouts.length > 0) {
    throw new Error("Sync du plan impossible: aucun plan actif local n'est disponible.");
  }

  localWorkouts.forEach((workout) => {
    assertUuidList(`planned_workouts/${workout.id}`, workout.exerciseIds);
  });

  const { data: remoteWorkouts, error: fetchError } = await context.supabase
    .from("planned_workouts")
    .select("id")
    .eq("user_id", context.userId);

  if (fetchError) {
    throw fetchError;
  }

  const idsToDelete =
    (remoteWorkouts ?? [])
      .map((workout) => workout.id)
      .filter((workoutId) => !localIds.has(workoutId));

  if (idsToDelete.length > 0) {
    const { error } = await context.supabase.from("planned_workouts").delete().in("id", idsToDelete);

    if (error) {
      throw error;
    }
  }

  if (localWorkouts.length === 0 || !activePlan) {
    return;
  }

  const { error: upsertError } = await context.supabase.from("planned_workouts").upsert(
    localWorkouts.map((workout) => ({
      id: workout.id,
      user_id: context.userId,
      training_plan_id: activePlan.id,
      day_label: workout.dayLabel,
      name: workout.name,
      scheduled_for: toScheduledDate(workout.date),
      status: workout.status,
      duration_minutes: workout.durationMinutes,
      notes: null
    })),
    {
      onConflict: "id"
    }
  );

  if (upsertError) {
    throw upsertError;
  }

  const workoutIds = localWorkouts.map((workout) => workout.id);

  const { error: deleteExerciseError } = await context.supabase
    .from("planned_workout_exercises")
    .delete()
    .in("planned_workout_id", workoutIds);

  if (deleteExerciseError) {
    throw deleteExerciseError;
  }

  const plannedWorkoutExercises = localWorkouts.flatMap((workout) =>
    workout.exerciseIds.map((exerciseId, index) => ({
      planned_workout_id: workout.id,
      exercise_id: exerciseId,
      sort_order: index,
      target_sets: 3,
      target_reps: "8-10",
      target_rest_seconds: 120
    }))
  );

  if (plannedWorkoutExercises.length === 0) {
    return;
  }

  const { error: insertExerciseError } = await context.supabase
    .from("planned_workout_exercises")
    .insert(plannedWorkoutExercises);

  if (insertExerciseError) {
    throw insertExerciseError;
  }
}

async function syncWorkoutSession(context: SyncContext, item: SyncQueueItem) {
  const sessionId = typeof item.payload.sessionId === "string" ? item.payload.sessionId : null;

  if (!sessionId) {
    throw new Error("Sync workout_sessions impossible: sessionId manquant dans la queue locale.");
  }

  const session = await db.workoutSessions.get(sessionId);

  if (!session) {
    throw new Error("Sync workout_sessions impossible: la séance locale n'existe plus.");
  }

  assertUuidList(
    `workout_sessions/${session.id}`,
    session.sets.map((set) => set.exerciseId)
  );

  const { error: upsertError } = await context.supabase.from("workout_sessions").upsert(
    {
      id: session.id,
      user_id: context.userId,
      planned_workout_id: isUuid(session.plannedWorkoutId) ? session.plannedWorkoutId : null,
      performed_at: session.date,
      status: session.status,
      notes: session.notes,
      summary: session.summary,
      client_mutation_id: item.clientMutationId
    },
    {
      onConflict: "id"
    }
  );

  if (upsertError) {
    throw upsertError;
  }

  const { error: deleteLogsError } = await context.supabase
    .from("set_logs")
    .delete()
    .eq("workout_session_id", session.id);

  if (deleteLogsError) {
    throw deleteLogsError;
  }

  if (session.sets.length === 0) {
    return;
  }

  const { error: insertLogsError } = await context.supabase.from("set_logs").insert(
    session.sets.map((set) => ({
      workout_session_id: session.id,
      exercise_id: set.exerciseId,
      set_number: set.setNumber,
      reps: set.reps,
      load_kg: set.loadKg,
      rest_seconds: set.restSeconds,
      effort: set.effort,
      completed: set.completed
    }))
  );

  if (insertLogsError) {
    throw insertLogsError;
  }
}

async function syncMealEntry(context: SyncContext, item: SyncQueueItem) {
  const entryId = typeof item.payload.entryId === "string" ? item.payload.entryId : null;

  if (!entryId) {
    throw new Error("Sync meal_entries impossible: entryId manquant dans la queue locale.");
  }

  const entry = await db.mealEntries.get(entryId);

  if (!entry) {
    throw new Error("Sync meal_entries impossible: le repas local n'existe plus.");
  }

  const { error: upsertError } = await context.supabase.from("meal_entries").upsert(
    {
      id: entry.id,
      user_id: context.userId,
      meal_name: entry.mealName,
      eaten_at: entry.date,
      source: entry.source,
      confidence: entry.confidence,
      user_validated: entry.validated,
      client_mutation_id: item.clientMutationId
    },
    {
      onConflict: "id"
    }
  );

  if (upsertError) {
    throw upsertError;
  }

  const { error: deleteItemsError } = await context.supabase
    .from("meal_entry_items")
    .delete()
    .eq("meal_entry_id", entry.id);

  if (deleteItemsError) {
    throw deleteItemsError;
  }

  if (entry.items.length === 0) {
    return;
  }

  const { error: insertItemsError } = await context.supabase.from("meal_entry_items").insert(
    entry.items.map((mealItem) => ({
      id: isUuid(mealItem.id) ? mealItem.id : undefined,
      meal_entry_id: entry.id,
      food_item_id: isUuid(mealItem.foodId) ? mealItem.foodId : null,
      label: mealItem.label,
      quantity: mealItem.quantity,
      calories: mealItem.calories,
      protein: mealItem.protein,
      carbs: mealItem.carbs,
      fats: mealItem.fats
    }))
  );

  if (insertItemsError) {
    throw insertItemsError;
  }
}

async function syncProgressCheckin(context: SyncContext, item: SyncQueueItem) {
  const checkinId =
    typeof item.payload.checkinId === "string"
      ? item.payload.checkinId
      : typeof item.payload.id === "string"
        ? item.payload.id
        : null;

  if (!checkinId) {
    throw new Error("Sync progress_checkins impossible: checkinId manquant dans la queue locale.");
  }

  const checkin = await db.progressCheckins.get(checkinId);

  if (!checkin) {
    throw new Error("Sync progress_checkins impossible: le check-in local n'existe plus.");
  }

  const { error: recoveryError } = await context.supabase.from("recovery_checkins").upsert(
    {
      id: checkin.recovery.id,
      user_id: context.userId,
      sleep: checkin.recovery.sleep,
      energy: checkin.recovery.energy,
      fatigue: checkin.recovery.fatigue,
      soreness: checkin.recovery.soreness,
      comment: checkin.recovery.comment
    },
    {
      onConflict: "id"
    }
  );

  if (recoveryError) {
    throw recoveryError;
  }

  const { error: progressError } = await context.supabase.from("progress_checkins").upsert(
    {
      id: checkin.id,
      user_id: context.userId,
      happened_at: checkin.date,
      weight_kg: checkin.weightKg,
      note: checkin.note,
      context: checkin.context,
      recovery_checkin_id: checkin.recovery.id,
      client_mutation_id: item.clientMutationId
    },
    {
      onConflict: "id"
    }
  );

  if (progressError) {
    throw progressError;
  }
}

async function syncReminders(context: SyncContext) {
  const reminders = await db.reminders.toArray();

  const { data: remoteReminders, error: fetchError } = await context.supabase
    .from("reminders")
    .select("id")
    .eq("user_id", context.userId);

  if (fetchError) {
    throw fetchError;
  }

  const remoteIds = (remoteReminders ?? []).map((reminder) => reminder.id);

  if (remoteIds.length > 0) {
    const { error } = await context.supabase.from("reminders").delete().in("id", remoteIds);

    if (error) {
      throw error;
    }
  }

  if (reminders.length === 0) {
    return;
  }

  const { error: insertError } = await context.supabase.from("reminders").insert(
    reminders.map((reminder) => ({
      user_id: context.userId,
      type: reminder.type,
      label: reminder.label,
      schedule: reminder.schedule,
      enabled: reminder.enabled
    }))
  );

  if (insertError) {
    throw insertError;
  }
}

export async function pushSyncItem(context: SyncContext, item: SyncQueueItem) {
  switch (item.entity) {
    case "user_profiles":
      return syncUserProfile(context);
    case "user_settings":
      return syncUserSettings(context);
    case "training_plans":
      return syncTrainingPlans(context);
    case "planned_workouts":
      return syncPlannedWorkouts(context);
    case "workout_sessions":
      return syncWorkoutSession(context, item);
    case "meal_entries":
      return syncMealEntry(context, item);
    case "progress_checkins":
      return syncProgressCheckin(context, item);
    case "reminders":
      return syncReminders(context);
    default: {
      const unknownEntity: never = item.entity;
      throw new Error(`Entité de sync non prise en charge: ${unknownEntity}`);
    }
  }
}

export async function hydrateRemoteState(context: SyncContext) {
  const [
    profileResult,
    settingsResult,
    trainingPlansResult,
    plannedWorkoutsResult,
    workoutSessionsResult,
    mealEntriesResult,
    progressCheckinsResult,
    remindersResult
  ] = await Promise.all([
    context.supabase.from("user_profiles").select(
      "id, first_name, goal, level, equipment, constraints, nutrition_preferences, weekly_availability, units, tone, weight_kg, height_cm, age, streak_count"
    ).eq("id", context.userId).maybeSingle(),
    context.supabase.from("user_settings").select(
      "user_id, reminders_enabled, theme, ai_availability"
    ).eq("user_id", context.userId).maybeSingle(),
    context.supabase.from("training_plans").select(
      "id, user_id, name, version, status, weekly_structure"
    ).eq("user_id", context.userId).order("created_at", { ascending: true }),
    context.supabase.from("planned_workouts").select(
      "id, training_plan_id, day_label, name, scheduled_for, status, duration_minutes, planned_workout_exercises(exercise_id, sort_order)"
    ).eq("user_id", context.userId).order("scheduled_for", { ascending: true }),
    context.supabase.from("workout_sessions").select(
      "id, planned_workout_id, performed_at, status, notes, summary, set_logs(id, exercise_id, set_number, reps, load_kg, rest_seconds, effort, completed)"
    ).eq("user_id", context.userId).order("performed_at", { ascending: false }),
    context.supabase.from("meal_entries").select(
      "id, meal_name, eaten_at, source, confidence, user_validated, meal_entry_items(id, food_item_id, label, quantity, calories, protein, carbs, fats)"
    ).eq("user_id", context.userId).order("eaten_at", { ascending: false }),
    context.supabase.from("progress_checkins").select(
      "id, happened_at, weight_kg, note, context, recovery_checkin_id"
    ).eq("user_id", context.userId).order("happened_at", { ascending: false }),
    context.supabase.from("reminders").select(
      "id, type, label, schedule, enabled"
    ).eq("user_id", context.userId).order("created_at", { ascending: true })
  ]);

  if (profileResult.error) {
    throw profileResult.error;
  }

  if (settingsResult.error) {
    throw settingsResult.error;
  }

  if (trainingPlansResult.error) {
    throw trainingPlansResult.error;
  }

  if (plannedWorkoutsResult.error) {
    throw plannedWorkoutsResult.error;
  }

  if (workoutSessionsResult.error) {
    throw workoutSessionsResult.error;
  }

  if (mealEntriesResult.error) {
    throw mealEntriesResult.error;
  }

  if (progressCheckinsResult.error) {
    throw progressCheckinsResult.error;
  }

  if (remindersResult.error) {
    throw remindersResult.error;
  }

  const progressRows = (progressCheckinsResult.data ?? []) as RemoteProgressCheckinRow[];
  const recoveryIds = progressRows
    .map((checkin) => checkin.recovery_checkin_id)
    .filter((value): value is string => Boolean(value));

  let recoveryRows: RemoteRecoveryCheckinRow[] = [];

  if (recoveryIds.length > 0) {
    const recoveryResult = await context.supabase
      .from("recovery_checkins")
      .select("id, sleep, energy, fatigue, soreness, comment")
      .in("id", recoveryIds);

    if (recoveryResult.error) {
      throw recoveryResult.error;
    }

    recoveryRows = (recoveryResult.data ?? []) as RemoteRecoveryCheckinRow[];
  }

  const recoveryById = new Map(recoveryRows.map((recovery) => [recovery.id, recovery]));

  await db.transaction(
    "rw",
    [
      db.profile,
      db.settings,
      db.trainingPlans,
      db.plannedWorkouts,
      db.workoutSessions,
      db.mealEntries,
      db.progressCheckins,
      db.reminders
    ],
    async () => {
      if (profileResult.data) {
        await db.profile.put(mapProfileRow(profileResult.data as RemoteProfileRow));
      }

      if (settingsResult.data) {
        await db.settings.put(mapSettingsRow(settingsResult.data as RemoteSettingsRow));
      }

      await db.trainingPlans.clear();
      await db.plannedWorkouts.clear();
      await db.workoutSessions.clear();
      await db.mealEntries.clear();
      await db.progressCheckins.clear();
      await db.reminders.clear();

      const trainingPlans = (trainingPlansResult.data ?? []) as RemoteTrainingPlanRow[];
      if (trainingPlans.length > 0) {
        await db.trainingPlans.bulkPut(trainingPlans.map(mapTrainingPlanRow));
      }

      const plannedWorkouts = (plannedWorkoutsResult.data ?? []) as RemotePlannedWorkoutRow[];
      if (plannedWorkouts.length > 0) {
        await db.plannedWorkouts.bulkPut(plannedWorkouts.map(mapPlannedWorkoutRow));
      }

      const workoutSessions = (workoutSessionsResult.data ?? []) as RemoteWorkoutSessionRow[];
      if (workoutSessions.length > 0) {
        await db.workoutSessions.bulkPut(workoutSessions.map(mapWorkoutSessionRow));
      }

      const mealEntries = (mealEntriesResult.data ?? []) as RemoteMealEntryRow[];
      if (mealEntries.length > 0) {
        await db.mealEntries.bulkPut(mealEntries.map(mapMealEntryRow));
      }

      if (progressRows.length > 0) {
        await db.progressCheckins.bulkPut(
          progressRows.map((row) => mapProgressCheckinRow(row, recoveryById))
        );
      }

      const reminders = (remindersResult.data ?? []) as RemoteReminderRow[];
      if (reminders.length > 0) {
        await db.reminders.bulkPut(reminders.map(mapReminderRow));
      }
    }
  );
}
