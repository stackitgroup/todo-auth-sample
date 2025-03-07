import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { LoggerModule } from 'nestjs-pino'
import { NODE_ENV } from './env.config'
import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware
} from './infrastructure/correlation-id.middleware'

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: NODE_ENV === 'development' ? 'debug' : 'info',
        transport:
          NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: true,
                  messageKey: 'message',
                  ignore: 'time,pid,hostname'
                }
              }
            : undefined,
        messageKey: 'message',
        customProps: (req: FastifyRequest['raw']) => ({
          correlationId: req.headers[CORRELATION_ID_HEADER]
        }),
        autoLogging: false,
        serializers: {
          req: () => undefined,
          res: () => undefined
        }
      }
    })
  ]
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*')
  }
}
