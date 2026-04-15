"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/offline/db";
import { enqueueSyncItem } from "@/lib/offline/sync-engine";

export function ProgressCheckinCard() {
  const [weightKg, setWeightKg] = useState("78.0");
  const [sleep, setSleep] = useState("4");
  const [energy, setEnergy] = useState("4");
  const [fatigue, setFatigue] = useState("2");

  async function handleSave() {
    const id = crypto.randomUUID();

    await db.progressCheckins.put({
      id,
      date: new Date().toISOString(),
      weightKg: Number(weightKg),
      note: "Check-in ajouté depuis le scaffold.",
      photoCount: 0,
      context: "ad_hoc",
      recovery: {
        id: crypto.randomUUID(),
        sleep: Number(sleep),
        energy: Number(energy),
        fatigue: Number(fatigue),
        soreness: 2,
        comment: ""
      }
    });

    await enqueueSyncItem({
      entity: "progress_checkins",
      action: "create",
      payload: {
        id,
        weightKg,
        sleep,
        energy,
        fatigue
      }
    });
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
          Check-in rapide
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          Poids, récupération et ressenti restent enregistrables même hors ligne.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="weight-checkin">Poids</Label>
          <Input id="weight-checkin" value={weightKg} onChange={(event) => setWeightKg(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="sleep-checkin">Sommeil</Label>
          <Input id="sleep-checkin" value={sleep} onChange={(event) => setSleep(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="energy-checkin">Énergie</Label>
          <Input id="energy-checkin" value={energy} onChange={(event) => setEnergy(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="fatigue-checkin">Fatigue</Label>
          <Input id="fatigue-checkin" value={fatigue} onChange={(event) => setFatigue(event.target.value)} />
        </div>
      </div>

      <Button onClick={handleSave}>Enregistrer le check-in</Button>
    </Card>
  );
}

