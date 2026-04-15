"use client";

import { WifiOff, UploadCloud, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { fr } from "@/lib/i18n/fr";
import { useAppShellStore } from "@/lib/store/use-app-shell-store";

export function AppHeader({
  title,
  eyebrow,
  action
}: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
}) {
  const syncBadge = useAppShellStore((state) => state.syncBadge);

  const badgeMap = {
    offline: {
      label: fr.offlineBadge,
      tone: "warning" as const,
      icon: <WifiOff className="h-3.5 w-3.5" />
    },
    sync_pending: {
      label: fr.syncPendingBadge,
      tone: "accent" as const,
      icon: <UploadCloud className="h-3.5 w-3.5" />
    },
    synced: {
      label: fr.syncedBadge,
      tone: "success" as const,
      icon: <ShieldCheck className="h-3.5 w-3.5" />
    }
  };

  const current = badgeMap[syncBadge];

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-[1.75rem] font-semibold tracking-[-0.05em] text-balance text-foreground">
          {title}
        </h1>
      </div>

      <div className="flex flex-col items-end gap-3">
        <Badge tone={current.tone} className="gap-1.5">
          {current.icon}
          {current.label}
        </Badge>
        {action}
      </div>
    </header>
  );
}

