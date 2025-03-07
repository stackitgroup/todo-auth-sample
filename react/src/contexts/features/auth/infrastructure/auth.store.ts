import { create } from 'zustand'

export type AuthState = {
  userId: string,
  userAccessToken: string
}

export const useAuthStore = create<AuthState>(() => ({
  userId: "",
  userAccessToken: ""
}))
