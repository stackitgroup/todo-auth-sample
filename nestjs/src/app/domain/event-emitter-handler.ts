export abstract class EventEmitterHandler {
  on: (event: string, listener: (...args: unknown[]) => void) => void
  emit: (event: string, ...args: unknown[]) => void
}
