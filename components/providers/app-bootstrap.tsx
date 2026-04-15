"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react";

import { useAuthIdentity } from "@/hooks/use-auth-identity";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { ensureLocalUserScope, primeLocalCache } from "@/lib/offline/db";
import { getSyncQueueSummary, runSyncCycle } from "@/lib/offline/sync-engine";
import { useAppShellStore } from "@/lib/store/use-app-shell-store";

const defaultQueueSummary = {
  failed: 0,
  pending: 0,
  queued: 0,
  syncing: 0
};

export function AppBootstrap() {
  const isOnline = useNetworkStatus();
  const { authState, identityKey, isLoading } = useAuthIdentity();
  const setRetrySync = useAppShellStore((state) => state.setRetrySync);
  const setSyncBadge = useAppShellStore((state) => state.setSyncBadge);
  const queueSummary = useLiveQuery(getSyncQueueSummary, [], defaultQueueSummary) ?? defaultQueueSummary;

  useEffect(() => {
    void primeLocalCache();
  }, []);

  useEffect(() => {
    if (isLoading || !authState?.isAuthenticated || !identityKey) {
      return;
    }

    void ensureLocalUserScope(identityKey, authState.email);
  }, [authState?.email, authState?.isAuthenticated, identityKey, isLoading]);

  const runSync = useCallback(
    async (includeFailed = false) => {
      if (!isOnline || isLoading || !authState?.isAuthenticated || !identityKey) {
        return;
      }

      await ensureLocalUserScope(identityKey, authState.email);
      await runSyncCycle({ includeFailed });
    },
    [authState?.email, authState?.isAuthenticated, identityKey, isLoading, isOnline]
  );

  useEffect(() => {
    setRetrySync(() => {
      void runSync(true);
    });

    return () => {
      setRetrySync(null);
    };
  }, [runSync, setRetrySync]);

  useEffect(() => {
    if (!isOnline) {
      setSyncBadge("offline");
      return;
    }

    if (queueSummary.failed > 0) {
      setSyncBadge("sync_failed");
      return;
    }

    if (queueSummary.pending > 0) {
      setSyncBadge("sync_pending");
      return;
    }

    setSyncBadge("synced");
  }, [isOnline, queueSummary.failed, queueSummary.pending, setSyncBadge]);

  useEffect(() => {
    if (!isOnline || isLoading || !authState?.isAuthenticated || !identityKey) {
      return;
    }

    void runSync();
  }, [authState?.isAuthenticated, identityKey, isLoading, isOnline, queueSummary.pending, runSync]);

  return null;
}
