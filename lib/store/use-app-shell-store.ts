import { create } from "zustand";

type SyncBadge = "synced" | "sync_pending" | "offline";

type AppShellState = {
  syncBadge: SyncBadge;
  setSyncBadge: (badge: SyncBadge) => void;
};

export const useAppShellStore = create<AppShellState>((set) => ({
  syncBadge: "synced",
  setSyncBadge: (syncBadge) => set({ syncBadge })
}));

