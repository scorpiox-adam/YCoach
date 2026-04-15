"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { ScreenShell } from "@/components/shell/screen-shell";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuthIdentity } from "@/hooks/use-auth-identity";
import { db } from "@/lib/offline/db";

export default function ProfilePage() {
  const { identityKey } = useAuthIdentity();
  const profile = useLiveQuery(
    () => (identityKey ? db.profile.get(identityKey) : undefined),
    [identityKey]
  );

  return (
    <ScreenShell eyebrow="Profil" title="Préférences utiles au coaching">
      <Card className="space-y-4">
        <div>
          <p className="font-display text-xl font-semibold tracking-[-0.04em] text-foreground">
            {profile?.firstName}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Objectif {profile?.goal} · niveau {profile?.level}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile?.equipment.map((item) => (
            <Badge key={item} tone="default">
              {item}
            </Badge>
          ))}
        </div>
      </Card>

      <section className="space-y-4">
        <SectionHeading
          title="Planning hebdomadaire"
          description="Le profil concentre ce qui aide le coaching, pas un formulaire exhaustif."
        />
        <div className="space-y-3">
          {profile?.weeklyAvailability.map((item) => (
            <Card key={item} className="p-4">
              <p className="text-sm text-foreground">{item}</p>
            </Card>
          ))}
        </div>
      </section>
    </ScreenShell>
  );
}
