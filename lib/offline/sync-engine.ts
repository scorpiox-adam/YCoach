import { db } from "@/lib/offline/db";
import { createClientMutationId } from "@/lib/offline/sync-contract";
import { getSyncContext, hydrateRemoteState, pushSyncItem } from "@/lib/offline/supabase-sync";
import type { SyncEntity, SyncQueueItem } from "@/lib/types";

const backoffSteps = [1_000, 2_000, 4_000, 8_000, 16_000];
const maxAttempts = 5;

function getRetryDelayMs(attempts: number) {
  return backoffSteps[Math.min(Math.max(attempts - 1, 0), backoffSteps.length - 1)] ?? 16_000;
}

function canRetryItem(item: SyncQueueItem, includeFailed: boolean) {
  if (item.status === "syncing" || item.status === "synced") {
    return false;
  }

  if (item.status === "failed" && !includeFailed) {
    return false;
  }

  if (!item.lastAttemptAt || item.attempts === 0) {
    return true;
  }

  const nextRetryAt = new Date(item.lastAttemptAt).getTime() + getRetryDelayMs(item.attempts);
  return Date.now() >= nextRetryAt;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Une erreur de synchronisation inconnue est survenue.";
}

export async function getSyncQueueSummary() {
  const [queued, syncing, failed] = await Promise.all([
    db.syncQueue.where("status").equals("queued").count(),
    db.syncQueue.where("status").equals("syncing").count(),
    db.syncQueue.where("status").equals("failed").count()
  ]);

  return {
    failed,
    pending: queued + syncing,
    queued,
    syncing
  };
}

export async function flushSyncQueue({
  includeFailed = false
}: {
  includeFailed?: boolean;
} = {}) {
  const context = await getSyncContext();

  if (!context) {
    return {
      flushed: 0,
      skipped: 0
    };
  }

  const allItems = await db.syncQueue.toArray();
  const items = allItems
    .slice()
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
    .filter((item) => canRetryItem(item, includeFailed));
  let flushed = 0;

  for (const item of items) {
    const attempts = item.attempts + 1;
    const now = new Date().toISOString();

    await db.syncQueue.update(item.id, {
      attempts,
      lastAttemptAt: now,
      lastError: null,
      status: "syncing"
    });

    try {
      await pushSyncItem(context, {
        ...item,
        attempts,
        lastAttemptAt: now,
        lastError: null,
        status: "syncing"
      });

      await db.syncQueue.update(item.id, {
        lastError: null,
        status: "synced"
      });

      flushed += 1;
    } catch (error) {
      const nextStatus = attempts >= maxAttempts ? "failed" : "queued";

      await db.syncQueue.update(item.id, {
        lastError: getErrorMessage(error),
        status: nextStatus
      });

      console.error("Sync failed", error);
    }
  }

  return {
    flushed,
    skipped: allItems.length - items.length
  };
}

export async function runSyncCycle({
  includeFailed = false
}: {
  includeFailed?: boolean;
} = {}) {
  const context = await getSyncContext();

  if (!context) {
    return {
      hydrated: false,
      flushed: 0
    };
  }

  const flushResult = await flushSyncQueue({ includeFailed });
  const summary = await getSyncQueueSummary();

  if (summary.pending > 0 || summary.failed > 0) {
    return {
      hydrated: false,
      flushed: flushResult.flushed
    };
  }

  await hydrateRemoteState(context);

  return {
    hydrated: true,
    flushed: flushResult.flushed
  };
}

export async function enqueueSyncItem({
  entity,
  action,
  payload
}: {
  action: SyncQueueItem["action"];
  entity: SyncEntity;
  payload: Record<string, unknown>;
}) {
  const now = new Date().toISOString();

  await db.syncQueue.put({
    id: crypto.randomUUID(),
    entity,
    action,
    payload,
    attempts: 0,
    lastAttemptAt: null,
    status: "queued",
    clientMutationId: createClientMutationId(),
    createdAt: now,
    lastError: null
  });
}
