import type { SyncEntity } from "@/lib/types";

export type SyncStrategy = "append-only" | "last-write-wins";

export type SyncContract = {
  entity: SyncEntity;
  strategy: SyncStrategy;
  description: string;
  remoteTables: string[];
};

export const syncContracts: Record<SyncEntity, SyncContract> = {
  user_profiles: {
    entity: "user_profiles",
    strategy: "last-write-wins",
    description: "Le profil utilisateur est remplace par la derniere version locale confirmee.",
    remoteTables: ["user_profiles"]
  },
  user_settings: {
    entity: "user_settings",
    strategy: "last-write-wins",
    description: "Les reglages utilisateur sont fusionnes par user_id avec priorite a la derniere ecriture locale.",
    remoteTables: ["user_settings"]
  },
  training_plans: {
    entity: "training_plans",
    strategy: "last-write-wins",
    description: "Le plan actif et sa structure hebdomadaire sont remplaces par la derniere version locale.",
    remoteTables: ["training_plans"]
  },
  planned_workouts: {
    entity: "planned_workouts",
    strategy: "last-write-wins",
    description: "Les seances planifiees et leurs exercices cibles sont remplaces pour refléter l'etat local courant.",
    remoteTables: ["planned_workouts", "planned_workout_exercises"]
  },
  workout_sessions: {
    entity: "workout_sessions",
    strategy: "append-only",
    description: "Chaque seance loggee est un evenement idempotent rattache a un clientMutationId unique.",
    remoteTables: ["workout_sessions", "set_logs"]
  },
  meal_entries: {
    entity: "meal_entries",
    strategy: "append-only",
    description: "Chaque repas cree un evenement durable avec ses items detailes et ne remplace pas l'historique.",
    remoteTables: ["meal_entries", "meal_entry_items"]
  },
  progress_checkins: {
    entity: "progress_checkins",
    strategy: "append-only",
    description: "Chaque check-in de progression est historise avec son bloc recuperation associe.",
    remoteTables: ["progress_checkins", "recovery_checkins"]
  },
  reminders: {
    entity: "reminders",
    strategy: "last-write-wins",
    description: "Les rappels utilisateur sont remplaces par leur derniere configuration locale connue.",
    remoteTables: ["reminders"]
  }
};

export function createClientMutationId() {
  return crypto.randomUUID();
}
