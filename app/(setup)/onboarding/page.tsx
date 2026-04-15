import { OnboardingWizard } from "@/components/cards/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <main className="safe-shell mx-auto flex min-h-screen w-full max-w-md flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Onboarding
        </p>
        <h1 className="font-display text-[2rem] font-semibold tracking-[-0.05em] text-foreground">
          On pose ton cadre initial en 5 étapes.
        </h1>
      </div>
      <OnboardingWizard />
    </main>
  );
}

