import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/types";
import { clearTokenCookie, setTokenCookie } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        setTokenCookie(token);
        set({ user, token });
      },
      clearAuth: () => {
        clearTokenCookie();
        set({ user: null, token: null });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: "rentnest-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
