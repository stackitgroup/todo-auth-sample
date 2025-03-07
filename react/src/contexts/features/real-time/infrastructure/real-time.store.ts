import { Socket } from 'socket.io-client';
import { create } from 'zustand'

export type RealTimeState = {
    socket: Socket | null;
    response: string;
}

export const useRealTimeStore = create<RealTimeState>(() => ({
    response: "",
    socket: null,
}))
