import { create } from "zustand";

type QuickAddTarget = "expense" | "income" | null;

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  quickAddTarget: QuickAddTarget;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  openQuickAdd: (target: Exclude<QuickAddTarget, null>) => void;
  closeQuickAdd: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  quickAddTarget: null,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  openQuickAdd: (target) => set({ quickAddTarget: target }),
  closeQuickAdd: () => set({ quickAddTarget: null }),
}));
