"use client";

import { useEffect } from "react";

import { useNetworkStatus } from "@/hooks/use-network-status";
import { db, primeLocalCache } from "@/lib/offline/db";
import { flushSyncQueue } from "@/lib/offline/sync-engine";
import { useAppShellStore } from "@/lib/store/use-app-shell-store";

export function AppBootstrap() {
  const isOnline = useNetworkStatus();
  const setSyncBadge = useAppShellStore((state) => state.setSyncBadge);

  useEffect(() => {
    void primeLocalCache();
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setSyncBadge("offline");
      return;
    }

    void db.syncQueue
      .where("status")
      .equals("queued")
      .count()
      .then((count) => setSyncBadge(count > 0 ? "sync_pending" : "synced"));
  }, [isOnline, setSyncBadge]);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    void flushSyncQueue().then(() => {
      setSyncBadge("synced");
    });
  }, [isOnline, setSyncBadge]);

  return null;
}

