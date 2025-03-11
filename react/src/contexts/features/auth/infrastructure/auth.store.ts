import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../domain/user'

export type AuthState = {
  user: User | null
  isAuthenticated: boolean
  userAccessToken: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (): AuthState => ({
      user: null,
      isAuthenticated: false,
      userAccessToken: "",
    }),
    {
      name: 'auth-storage',
    }
  )
)
