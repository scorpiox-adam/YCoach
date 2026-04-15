"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup" | "forgot-password";

export function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const copy = {
    "login": {
      title: "Reprends ta semaine en main",
      description: "Connecte-toi pour retrouver ton agenda, tes séances et ta progression.",
      primaryLabel: "Se connecter",
      secondaryLabel: "Créer un compte",
      secondaryHref: "/signup"
    },
    "signup": {
      title: "Crée ton cadre de départ",
      description: "Le compte est obligatoire pour synchroniser tes données et garder tes photos privées.",
      primaryLabel: "Créer mon compte",
      secondaryLabel: "Déjà un compte",
      secondaryHref: "/login"
    },
    "forgot-password": {
      title: "Récupère ton accès",
      description: "On t'envoie un lien de récupération par email dès que ton projet Supabase est branché.",
      primaryLabel: "Envoyer le lien",
      secondaryLabel: "Retour à la connexion",
      secondaryHref: "/login"
    }
  }[mode];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFeedback(null);

    startTransition(() => {
      void (async () => {
        const supabase = createSupabaseBrowserClient();

        try {
          if (!supabase) {
            setFeedback("Le projet est scaffoldé. Branche Supabase pour rendre l'auth réelle.");
            if (mode !== "forgot-password") {
              router.push(mode === "signup" ? "/onboarding" : "/agenda");
            }
            return;
          }

          if (mode === "login") {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
              setFeedback(error.message);
              return;
            }
            router.push("/agenda");
            return;
          }

          if (mode === "signup") {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
              setFeedback(error.message);
              return;
            }
            router.push("/onboarding");
            return;
          }

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`
          });
          setFeedback(error ? error.message : "Lien envoyé. Vérifie ta boîte mail.");
        } finally {
          setPending(false);
        }
      })();
    });
  }

  return (
    <Card className="space-y-6">
      <div className="space-y-2">
        <CardTitle className="text-2xl">{copy.title}</CardTitle>
        <CardDescription>{copy.description}</CardDescription>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor={`${mode}-email`}>Email</Label>
          <Input
            id={`${mode}-email`}
            type="email"
            placeholder="toi@exemple.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        {mode !== "forgot-password" ? (
          <div>
            <Label htmlFor={`${mode}-password`}>Mot de passe</Label>
            <Input
              id={`${mode}-password`}
              type="password"
              placeholder="Au moins 8 caractères"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        ) : null}

        {feedback ? (
          <p className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-6 text-muted-foreground">
            {feedback}
          </p>
        ) : null}

        <div className="space-y-3">
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Traitement en cours..." : copy.primaryLabel}
          </Button>
          <Link
            href={copy.secondaryHref}
            className={buttonVariants({ variant: "secondary", className: "w-full" })}
          >
            {copy.secondaryLabel}
          </Link>
        </div>
      </form>

      {mode === "login" ? (
        <Link className="block text-sm font-medium text-muted-foreground" href="/forgot-password">
          Mot de passe oublié
        </Link>
      ) : null}
    </Card>
  );
}
