import { SignOutCard } from "@/components/cards/sign-out-card";
import { SettingsCard } from "@/components/cards/settings-card";
import { ScreenShell } from "@/components/shell/screen-shell";
import { StateCard } from "@/components/cards/state-card";

export default function SettingsPage() {
  return (
    <ScreenShell eyebrow="Réglages" title="Notifications, confidentialité et IA">
      <SettingsCard />
      <StateCard
        title="Notifications et rappels"
        description="Le fallback prévu en v1 est explicite: si le push natif n'est pas disponible, le rappel devient une bannière in-app au prochain lancement."
        badge={{ label: "Prévu", tone: "warning" }}
        cta={{ label: "Configurer les rappels" }}
      />
      <StateCard
        title="Confidentialité"
        description="Les photos de progression sont privées par défaut. Les photos repas ne sont pas persistées côté serveur en v1."
        badge={{ label: "RLS requis", tone: "accent" }}
      />
      <SignOutCard />
    </ScreenShell>
  );
}
