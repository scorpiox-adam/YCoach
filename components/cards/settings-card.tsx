"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/offline/db";
import { fr } from "@/lib/i18n/fr";
import { enqueueSyncItem } from "@/lib/offline/sync-engine";

export function SettingsCard() {
  const [key, setKey] = useState("");
  const [visible, setVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSave() {
    const masked = key ? `${key.slice(0, 4)}••••${key.slice(-4)}` : "";

    await db.settings.update("settings-demo", {
      openAiKeyMasked: masked,
      aiAvailability: key ? "ready" : "missing_key"
    });

    await enqueueSyncItem({
      entity: "user_settings",
      action: "update",
      payload: {
        openAiKeyMasked: masked
      }
    });

    setFeedback(key ? "Clé enregistrée localement. Elle devra être chiffrée côté Supabase." : "Clé retirée du profil local.");
  }

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
          Clé API OpenAI
        </p>
        <p className="text-sm leading-6 text-muted-foreground">{fr.settingsHint}</p>
      </div>

      <div>
        <Label htmlFor="openai-key">Clé masquée</Label>
        <div className="relative">
          <Input
            id="openai-key"
            type={visible ? "text" : "password"}
            placeholder="sk-..."
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="pr-12"
          />
          <button
            type="button"
            aria-label={visible ? "Masquer la clé" : "Afficher la clé"}
            onClick={() => setVisible((current) => !current)}
            className="absolute right-3 top-3.5 text-muted-foreground"
          >
            {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {feedback ? <p className="text-sm text-muted-foreground">{feedback}</p> : null}

      <Button onClick={handleSave}>Enregistrer la clé</Button>
    </Card>
  );
}

