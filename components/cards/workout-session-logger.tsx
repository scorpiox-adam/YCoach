"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/offline/db";
import { enqueueSyncItem } from "@/lib/offline/sync-engine";
import type { SetLog } from "@/lib/types";

type DraftSet = SetLog & {
  exerciseName: string;
};

export function WorkoutSessionLogger({ workoutId }: { workoutId: string }) {
  const router = useRouter();
  const workout = useLiveQuery(() => db.plannedWorkouts.get(workoutId), [workoutId]);
  const availableExercises = useLiveQuery(() => db.exercises.toArray(), []);
  const [notes, setNotes] = useState("");
  const [draftSets, setDraftSets] = useState<DraftSet[]>([]);

  useEffect(() => {
    if (!workout || !availableExercises?.length) {
      return;
    }

    setDraftSets(
      workout.exerciseIds.flatMap((exerciseId) => {
        const exercise = availableExercises.find((item) => item.id === exerciseId);
        if (!exercise) {
          return [];
        }

        return Array.from({ length: exercise.category === "Cardio" ? 1 : 3 }, (_, index) => ({
          id: `${workout.id}-${exerciseId}-${index + 1}`,
          exerciseId,
          exerciseName: exercise.name,
          setNumber: index + 1,
          reps: exercise.category === "Cardio" ? 30 : 8,
          loadKg: exercise.category === "Cardio" ? 0 : 40,
          restSeconds: exercise.category === "Cardio" ? 0 : 120,
          effort: 7,
          completed: false
        }));
      })
    );
  }, [availableExercises, workout]);

  async function handleSave() {
    if (!workout) {
      return;
    }

    const sessionId = crypto.randomUUID();

    await db.workoutSessions.put({
      id: sessionId,
      plannedWorkoutId: workout.id,
      date: new Date().toISOString(),
      status: "completed",
      notes,
      summary: "Séance enregistrée localement. En attente de synchronisation.",
      sets: draftSets
    });

    await db.plannedWorkouts.update(workout.id, { status: "completed" });

    await enqueueSyncItem({
      entity: "workout_sessions",
      action: "create",
      payload: {
        sessionId,
        plannedWorkoutId: workout.id,
        notes,
        sets: draftSets
      }
    });

    startTransition(() => {
      router.push("/training");
    });
  }

  if (!workout) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">
          Cette séance n'existe pas encore dans le cache local.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {draftSets.map((set) => (
        <Card key={set.id} className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
                {set.exerciseName}
              </p>
              <p className="text-sm text-muted-foreground">Série {set.setNumber}</p>
            </div>
            <Button
              variant={set.completed ? "primary" : "secondary"}
              size="sm"
              onClick={() =>
                setDraftSets((current) =>
                  current.map((item) =>
                    item.id === set.id ? { ...item, completed: !item.completed } : item
                  )
                )
              }
            >
              {set.completed ? "Validée" : "Valider"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              value={String(set.reps)}
              onChange={(event) =>
                setDraftSets((current) =>
                  current.map((item) =>
                    item.id === set.id ? { ...item, reps: Number(event.target.value) } : item
                  )
                )
              }
            />
            <Input
              value={String(set.loadKg)}
              onChange={(event) =>
                setDraftSets((current) =>
                  current.map((item) =>
                    item.id === set.id ? { ...item, loadKg: Number(event.target.value) } : item
                  )
                )
              }
            />
            <Input
              value={String(set.restSeconds)}
              onChange={(event) =>
                setDraftSets((current) =>
                  current.map((item) =>
                    item.id === set.id ? { ...item, restSeconds: Number(event.target.value) } : item
                  )
                )
              }
            />
          </div>
        </Card>
      ))}

      <Card className="space-y-3">
        <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
          Notes de séance
        </p>
        <Textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Ressenti, tempo, fatigue, repère utile pour la prochaine fois"
        />
        <Button onClick={handleSave}>Terminer et synchroniser plus tard</Button>
      </Card>
    </div>
  );
}

