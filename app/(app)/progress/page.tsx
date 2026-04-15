"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { MetricCard } from "@/components/cards/metric-card";
import { ProgressCheckinCard } from "@/components/cards/progress-checkin-card";
import { ScreenShell } from "@/components/shell/screen-shell";
import { SectionHeading } from "@/components/sections/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/offline/db";
import { formatKg, formatShortDate } from "@/lib/utils";

export default function ProgressPage() {
  const checkins = useLiveQuery(() => db.progressCheckins.orderBy("date").reverse().toArray(), []);
  const weeklySummary = useLiveQuery(() => db.weeklySummaries.toArray(), []);

  const latest = checkins?.[0];
  const previous = checkins?.[1];
  const delta = latest && previous ? (latest.weightKg - previous.weightKg).toFixed(1) : null;

  return (
    <ScreenShell eyebrow="Progression" title="Voir si les efforts produisent des résultats">
      <section className="grid grid-cols-2 gap-3">
        <MetricCard label="Poids" value={latest ? formatKg(latest.weightKg) : "--"} delta={delta ? `${delta} kg` : undefined} />
        <MetricCard label="Check-ins" value={String(checkins?.length ?? 0)} delta="7 jours offline" />
      </section>

      <ProgressCheckinCard />

      <section className="space-y-4">
        <SectionHeading
          title="Historique lisible"
          description="Les photos restent privées; ici le scaffold matérialise surtout le flux et la structure de données."
        />
        <div className="space-y-3">
          {checkins?.map((checkin) => (
            <Card key={checkin.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{formatShortDate(checkin.date)}</p>
                  <p className="text-xs text-muted-foreground">{formatKg(checkin.weightKg)}</p>
                </div>
                <Badge tone="default">{checkin.context}</Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{checkin.note}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Bilan hebdomadaire"
          description="Le bilan généré reste consultable dans l'historique de progression."
        />
        <div className="space-y-3">
          {weeklySummary?.map((summary) => (
            <Card key={summary.id} className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{summary.weekLabel}</p>
              </div>
              <div className="space-y-2">
                {summary.factualSummary.map((item) => (
                  <p key={item} className="text-sm leading-6 text-muted-foreground">
                    {item}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </ScreenShell>
  );
}

