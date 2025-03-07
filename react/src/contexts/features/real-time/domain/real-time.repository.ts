export abstract class RealTimeRepository {
    connect: () => void
    sendMessage: (message: string) => void
}
  