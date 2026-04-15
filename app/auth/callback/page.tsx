"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getFriendlyAuthErrorMessage,
  sanitizeInternalPath
} from "@/lib/auth/client-auth";
import { getSupabaseConfigErrorMessage } from "@/lib/config/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState("Validation du lien en cours...");

  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const errorDescription = searchParams.get("error_description");
  const nextPath = sanitizeInternalPath(searchParams.get("next"), "/agenda");

  useEffect(() => {
    const supabaseClient = createSupabaseBrowserClient();

    if (!supabaseClient) {
      setFeedback(getSupabaseConfigErrorMessage());
      return;
    }

    if (errorDescription) {
      setFeedback(errorDescription);
      return;
    }

    let cancelled = false;
    let fallbackTimer: number | undefined;

    const resolvedNextPath =
      type === "recovery" || nextPath === "/reset-password" ? "/reset-password" : nextPath;

    async function redirectIfSessionReady() {
      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session?.user || cancelled) {
        return false;
      }

      router.replace(resolvedNextPath);
      return true;
    }

    const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (cancelled || !session?.user) {
        return;
      }

      if (event === "PASSWORD_RECOVERY") {
        router.replace("/reset-password");
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        router.replace(resolvedNextPath);
      }
    });

    void (async () => {
      if (code) {
        const { error } = await supabaseClient.auth.exchangeCodeForSession(code);

        if (error) {
          setFeedback(getFriendlyAuthErrorMessage(error));
          return;
        }

        router.replace(resolvedNextPath);
        return;
      }

      if (await redirectIfSessionReady()) {
        return;
      }

      if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
        fallbackTimer = window.setTimeout(() => {
          void redirectIfSessionReady().then((didRedirect) => {
            if (!didRedirect && !cancelled) {
              setFeedback("Le lien a expire ou n'est plus valide. Demande un nouveau lien pour continuer.");
            }
          });
        }, 300);
        return;
      }

      setFeedback("Le lien est invalide ou incomplet. Demande un nouvel email pour continuer.");
    })();

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();

      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }
    };
  }, [code, errorDescription, nextPath, router, type]);

  return (
    <main className="safe-shell mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-8">
      <Card className="space-y-4 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          YCoach
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-[-0.05em] text-foreground">
          Verification du lien
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">{feedback}</p>
        <Link href="/login" className={buttonVariants({ variant: "secondary", className: "w-full" })}>
          Retour a la connexion
        </Link>
      </Card>
    </main>
  );
}
