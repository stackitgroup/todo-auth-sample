import { Socket } from 'socket.io-client'

export class RealTime {
    socket: Socket
    response: string
    connect: () => void
    sendMessage: (message: string) => void;
    constructor(attributes: {socket: Socket, response: string, connect: () => void, sendMessage: (message: string) => void}) {
      this.socket = attributes.socket
      this.response = attributes.response
      this.connect = attributes.connect
      this.sendMessage = attributes.sendMessage
    }
  }
  