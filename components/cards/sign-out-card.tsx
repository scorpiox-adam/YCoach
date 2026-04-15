"use client";

import { useRouter } from "next/navigation";

import { signOutClient } from "@/lib/auth/client-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SignOutCard() {
  const router = useRouter();

  async function handleSignOut() {
    await signOutClient();
    router.replace("/login");
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
          Déconnexion
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Tu fermes simplement la session active, sans supprimer les autres reglages locaux deja poses pour ce compte.
        </p>
      </div>
      <Button variant="secondary" onClick={handleSignOut}>
        Se déconnecter
      </Button>
    </Card>
  );
}
