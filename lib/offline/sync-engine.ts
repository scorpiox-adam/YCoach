import { db } from "@/lib/offline/db";

const backoffSteps = [1_000, 2_000, 4_000, 8_000, 16_000];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function flushSyncQueue() {
  const items = await db.syncQueue.where("status").anyOf(["queued", "failed"]).toArray();

  for (const item of items) {
    await db.syncQueue.update(item.id, {
      status: "syncing",
      attempts: item.attempts + 1,
      lastAttemptAt: new Date().toISOString()
    });

    try {
      await wait(120);

      await db.syncQueue.update(item.id, {
        status: "synced"
      });
    } catch (error) {
      const attemptIndex = Math.min(item.attempts, backoffSteps.length - 1);
      await wait(backoffSteps[attemptIndex] ?? backoffSteps[backoffSteps.length - 1] ?? 16_000);
      await db.syncQueue.update(item.id, {
        status: item.attempts + 1 >= 5 ? "failed" : "queued"
      });
      console.error("Sync failed", error);
    }
  }
}

export async function enqueueSyncItem({
  entity,
  action,
  payload
}: {
  entity: string;
  action: "create" | "update" | "delete" | "sync_ai";
  payload: Record<string, unknown>;
}) {
  await db.syncQueue.put({
    id: crypto.randomUUID(),
    entity,
    action,
    payload,
    attempts: 0,
    lastAttemptAt: null,
    status: "queued",
    clientMutationId: crypto.randomUUID()
  });
}
