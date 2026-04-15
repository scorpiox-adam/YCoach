"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getClientAuthState,
  readOnboardingComplete
} from "@/lib/auth/client-auth";

function LoadingGate({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="safe-shell mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4">
      <div className="surface-panel rounded-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          YCoach
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </main>
  );
}

export function AuthPageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const authState = await getClientAuthState();
      const onboardingComplete = readOnboardingComplete();

      if (authState.isAuthenticated) {
        router.replace(onboardingComplete ? "/agenda" : "/onboarding");
        return;
      }

      if (!cancelled) {
        setAllowed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!allowed) {
    return (
      <LoadingGate
        title="Préparation de l'accès"
        description="On vérifie d'abord si une session est déjà active."
      />
    );
  }

  return <>{children}</>;
}

export function OnboardingPageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const authState = await getClientAuthState();
      const onboardingComplete = readOnboardingComplete();

      if (!authState.isAuthenticated) {
        router.replace("/login");
        return;
      }

      if (onboardingComplete) {
        router.replace("/agenda");
        return;
      }

      if (!cancelled) {
        setAllowed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!allowed) {
    return (
      <LoadingGate
        title="Préparation de ton onboarding"
        description="On vérifie que la session est bien ouverte avant de générer ton cadre initial."
      />
    );
  }

  return <>{children}</>;
}

export function AppPageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const authState = await getClientAuthState();
      const onboardingComplete = readOnboardingComplete();

      if (!authState.isAuthenticated) {
        router.replace("/login");
        return;
      }

      if (!onboardingComplete) {
        router.replace("/onboarding");
        return;
      }

      if (!cancelled) {
        setAllowed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!allowed) {
    return (
      <LoadingGate
        title="Préparation de ton espace"
        description="On recharge ta session et on vérifie que l'onboarding est terminé."
      />
    );
  }

  return <>{children}</>;
}

