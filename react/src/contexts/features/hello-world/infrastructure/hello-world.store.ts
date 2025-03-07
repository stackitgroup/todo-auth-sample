import { create } from 'zustand'

export type HelloWorldState = {
  counter: number
}

export const useHelloWorldStore = create<HelloWorldState>(() => ({
  counter: 0
}))
