import { Global, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventEmitterHandler } from '../domain/event-emitter-handler'
@Global()
@Injectable()
export class NestEventEmitterHandler implements EventEmitterHandler {
  constructor(private readonly emitter: EventEmitter2) {}

  on(event: string, listener: (...args: unknown[]) => void) {
    this.emitter.on(event, listener)
  }

  emit(event: string, ...args: unknown[]) {
    this.emitter.emit(event, ...args)
  }
}
