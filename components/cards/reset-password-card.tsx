"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAuthIdentityKey,
  getFriendlyAuthErrorMessage,
  getPostAuthRedirectPath
} from "@/lib/auth/client-auth";
import { getSupabaseConfigErrorMessage } from "@/lib/config/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordCard() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);
  const [identity, setIdentity] = useState<string | null>(null);

  useEffect(() => {
    const supabaseClient = createSupabaseBrowserClient();

    if (!supabaseClient) {
      setFeedback(getSupabaseConfigErrorMessage());
      return;
    }

    let cancelled = false;

    async function hydrateSession() {
      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (cancelled) {
        return;
      }

      if (!session?.user) {
        setReady(false);
        setFeedback("Le lien de recuperation a expire ou n'est plus valide. Demande-en un nouveau pour continuer.");
        return;
      }

      setIdentity(getAuthIdentityKey({
        userId: session.user.id,
        email: session.user.email ?? null
      }));
      setReady(true);
      setFeedback(null);
    }

    void hydrateSession();

    const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (cancelled || !session?.user) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setIdentity(getAuthIdentityKey({
          userId: session.user.id,
          email: session.user.email ?? null
        }));
        setReady(true);
        setFeedback(null);
      }
    });

    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ready) {
      setFeedback("Ouvre d'abord le lien de recuperation recu par email.");
      return;
    }

    if (password.length < 8) {
      setFeedback("Choisis un mot de passe d'au moins 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setFeedback("Les deux mots de passe doivent etre identiques.");
      return;
    }

    setPending(true);
    setFeedback(null);

    startTransition(() => {
      void (async () => {
        const supabase = createSupabaseBrowserClient();

        try {
          if (!supabase) {
            setFeedback(getSupabaseConfigErrorMessage());
            return;
          }

          const { error } = await supabase.auth.updateUser({ password });

          if (error) {
            setFeedback(getFriendlyAuthErrorMessage(error));
            return;
          }

          router.replace(getPostAuthRedirectPath(identity));
        } finally {
          setPending(false);
        }
      })();
    });
  }

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <CardTitle className="text-2xl">Choisis ton nouveau mot de passe</CardTitle>
        <CardDescription>
          On met a jour l'acces du compte et on te renvoie directement vers la bonne etape ensuite.
        </CardDescription>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="reset-password">Nouveau mot de passe</Label>
          <Input
            id="reset-password"
            type="password"
            placeholder="Au moins 8 caracteres"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={pending || !ready}
            required
          />
        </div>

        <div>
          <Label htmlFor="reset-password-confirm">Confirmation</Label>
          <Input
            id="reset-password-confirm"
            type="password"
            placeholder="Retape le mot de passe"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={pending || !ready}
            required
          />
        </div>

        {feedback ? (
          <p className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-6 text-muted-foreground">
            {feedback}
          </p>
        ) : null}

        <div className="space-y-3">
          <Button className="w-full" type="submit" disabled={pending || !ready}>
            {pending ? "Mise a jour en cours..." : "Enregistrer le nouveau mot de passe"}
          </Button>
          <Link
            href="/forgot-password"
            className={buttonVariants({ variant: "secondary", className: "w-full" })}
          >
            Demander un nouveau lien
          </Link>
        </div>
      </form>
    </Card>
  );
}
