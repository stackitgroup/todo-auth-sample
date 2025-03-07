export class RealTime {
  private message: string

  constructor(message: string) {
    this.message = message
  }

  getMessage(): string {
    return this.message
  }

  setMessage(message: string) {
    this.message = message
  }
}
