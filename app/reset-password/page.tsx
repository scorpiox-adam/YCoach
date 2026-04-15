import { ResetPasswordCard } from "@/components/cards/reset-password-card";

export default function ResetPasswordPage() {
  return (
    <main className="safe-shell mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          YCoach
        </p>
        <h1 className="font-display text-[2.25rem] font-semibold tracking-[-0.06em] text-balance text-foreground">
          Recuperation d'acces
        </h1>
        <p className="max-w-[36ch] text-sm leading-6 text-muted-foreground">
          On finalise la recuperation du compte avec un nouveau mot de passe, sans te faire repasser par tout le flow.
        </p>
      </div>
      <ResetPasswordCard />
    </main>
  );
}
