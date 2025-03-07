import {
  LOG_LEVEL,
  NODE_ENV,
  SLACK_WEBHOOK_CHANNEL_NAME,
  SLACK_WEBHOOK_URL
} from '@/app/env.config'
import { Injectable } from '@nestjs/common'
import { Logger as PinoLogger } from 'nestjs-pino'
import { Logger as WinstonLogger, createLogger } from 'winston'
import SlackHook from 'winston-slack-webhook-transport'

const options = {
  console: {
    level: LOG_LEVEL || 'error'
  },
  slack: {
    webhookUrl: SLACK_WEBHOOK_URL || '',
    channel: SLACK_WEBHOOK_CHANNEL_NAME || ''
  },
  scope: NODE_ENV || 'development'
}

@Injectable()
export class CompositeLogger {
  private readonly pinoLogger: PinoLogger
  private readonly winstonLogger: WinstonLogger

  constructor(private readonly logger: PinoLogger) {
    this.pinoLogger = logger

    this.winstonLogger = createLogger({
      level: options.console.level,
      transports: [
        new SlackHook({
          webhookUrl: options.slack.webhookUrl,
          channel: `#${options.slack.webhookUrl}`,
          formatter: ({ message }) => ({
            text: `*[${options.scope.toUpperCase()}] Server*: ${message}`
          })
        })
      ]
    })
  }

  log(message: string, context?: string): void {
    this.pinoLogger.log(message, context)
  }

  error(message: string, trace?: string, context?: string): void {
    this.pinoLogger.error(message, context, trace)

    if (options.scope === 'development') {
      return
    }

    this.winstonLogger.error(message, context, trace)
  }

  warn(message: string, context?: string): void {
    this.pinoLogger.warn(message, context)
  }

  debug(message: string, context?: string): void {
    this.pinoLogger.debug(message, context)
  }
}
