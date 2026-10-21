import { create } from "zustand";
import { persist } from "zustand/middleware";

type TLoggedInUser = TLoginResponse["user"];

type UserStore = {
  user: TLoggedInUser | null;
  setUser: (user: TLoggedInUser) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "user" },
  ),
);
