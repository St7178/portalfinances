import { create } from "zustand";

interface UserPreferences {
  currency: string;
  locale: string;
}

interface UserState {
  name: string | null;
  email: string | null;
  image: string | null;
  preferences: UserPreferences;
  setUser: (user: { name: string | null; email: string | null; image: string | null }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: null,
  email: null,
  image: null,
  preferences: { currency: "USD", locale: "es-CO" },
  setUser: (user) => set(user),
  clearUser: () => set({ name: null, email: null, image: null }),
}));
