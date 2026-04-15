import { create } from "zustand";

type SyncBadge = "synced" | "sync_pending" | "sync_failed" | "offline";
type RetrySync = (() => void) | null;

type AppShellState = {
  retrySync: RetrySync;
  syncBadge: SyncBadge;
  setRetrySync: (callback: RetrySync) => void;
  setSyncBadge: (badge: SyncBadge) => void;
};

export const useAppShellStore = create<AppShellState>((set) => ({
  retrySync: null,
  syncBadge: "synced",
  setRetrySync: (retrySync) => set({ retrySync }),
  setSyncBadge: (syncBadge) => set({ syncBadge })
}));
