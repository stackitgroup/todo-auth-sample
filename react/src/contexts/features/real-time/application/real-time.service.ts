import { io, Socket } from 'socket.io-client'
import { useRealTimeStore } from '../infrastructure/real-time.store'
import { API_URL } from '@/contexts/shared/domain/constants/api-url'

export const RealTimeService = () => {
  let socket: Socket | null = null

  return {
    connect: () => {
      socket = io(API_URL)
      useRealTimeStore.setState({ socket })

      socket.on('msgFromServerDumb', (data: string) => {
        useRealTimeStore.setState({ response: data })
      })

      socket.on('msgFromServer', (data: {sender: string, message: string}) => {
        useRealTimeStore.setState({ response: data.sender })
      })

      socket.on('userJoined', (data: string) => {
        useRealTimeStore.setState({ response: data })
      })
    },
    sendMessageDumb: (message: string) => {
      if (socket) {
        socket.emit('msgToServer', message)
      }
    },
    sendMessage: (payload: { room: string; message: string }) => {
      if (socket) {
        socket.emit('msgToRoom', payload)
      }
    },
    joinChannel: (room: string) => {
      if (socket) {
        socket.emit('joinRoom', room)
      }
    }
  }
}

export const realTimeService = RealTimeService()
