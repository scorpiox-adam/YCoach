"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  getAuthIdentityKey,
  getClientAuthState,
  readOnboardingComplete
} from "@/lib/auth/client-auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    void (async () => {
      const authState = await getClientAuthState();
      const onboardingComplete = readOnboardingComplete(getAuthIdentityKey(authState));

      if (!authState.isAuthenticated) {
        router.replace("/login");
        return;
      }

      router.replace(onboardingComplete ? "/agenda" : "/onboarding");
    })();
  }, [router]);

  return (
    <main className="safe-shell mx-auto flex min-h-screen w-full max-w-md flex-col justify-center">
      <div className="surface-panel rounded-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          YCoach
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
          Redirection en cours
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          On t'envoie vers la bonne étape: connexion, onboarding ou espace principal.
        </p>
      </div>
    </main>
  );
}
