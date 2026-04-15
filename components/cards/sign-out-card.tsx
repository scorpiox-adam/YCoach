"use client";

import { useRouter } from "next/navigation";

import { signOutClient } from "@/lib/auth/client-auth";
import { resetUserScopedData } from "@/lib/offline/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SignOutCard() {
  const router = useRouter();

  async function handleSignOut() {
    await signOutClient();
    await resetUserScopedData();
    router.replace("/login");
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
          Déconnexion
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Pratique pour rejouer le parcours premier lancement sans effacer manuellement le navigateur.
        </p>
      </div>
      <Button variant="secondary" onClick={handleSignOut}>
        Se déconnecter
      </Button>
    </Card>
  );
}

