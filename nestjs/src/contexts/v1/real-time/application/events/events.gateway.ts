import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private userRooms = new Map<string, string>()

  handleConnection(client: Socket): void {
    console.log(`User Connected: ${client.id}`)
  }

  handleDisconnect(client: Socket): void {
    const room = this.userRooms.get(client.id)
    if (room) {
      client.leave(room)
      this.server.to(room).emit('userLeft', `User ${client.id} left channel`)
      this.userRooms.delete(client.id)
    }
    console.log(`User disconnected: ${client.id}`)
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    if (this.userRooms.has(client.id)) {
      const previousRoom = this.userRooms.get(client.id)
      client.leave(previousRoom)
    }
    client.join(room)
    this.userRooms.set(client.id, room)

    console.log(`User ${client.id} joined to room ${room}`)
    this.server
      .to(room)
      .emit('userJoined', `User ${client.id} joined to the room`)
  }

  @SubscribeMessage('msgToRoom')
  handleMessage(
    client: Socket,
    payload: { room: string; message: string }
  ): void {
    const { message, room } = payload
    if (this.userRooms.get(client.id) !== room) {
      return
    }
    this.server.to(room).emit('msgFromServer', { sender: client.id, message })
  }

  @SubscribeMessage('msgToServer')
  handleMessageDumb(client: Socket, message: string): void {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        this.server
          .to(client.id)
          .emit('msgFromServerDumb', `Response from server: ${i + 1}`)
      }, i * 500)
    }
  }
}
