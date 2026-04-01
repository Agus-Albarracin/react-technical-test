import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { AuthUser, LoginResponse } from '@/types/auth.type'

type AuthState = {
  accessToken: string | null
  user: AuthUser | null
  hasHydrated: boolean
  setSession: (session: LoginResponse) => void
  setUser: (user: AuthUser | null) => void
  logout: () => void
  setHasHydrated: (hasHydrated: boolean) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      setSession: (session) =>
        set({
          accessToken: session.accessToken,
          user: {
            id: session.id,
            email: session.email,
            firstName: session.firstName,
            lastName: session.lastName,
            username: session.username,
            image: session.image,
          },
        }),
      setUser: (user) => set({ user }),
      logout: () => set({ accessToken: null, user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export default useAuthStore
