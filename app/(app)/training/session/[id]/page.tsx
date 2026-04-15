import { WorkoutSessionLogger } from "@/components/cards/workout-session-logger";
import { ScreenShell } from "@/components/shell/screen-shell";

export default function TrainingSessionPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <ScreenShell eyebrow="Séance" title="Logger série par série, même hors ligne">
      <WorkoutSessionLogger workoutId={params.id} />
    </ScreenShell>
  );
}

