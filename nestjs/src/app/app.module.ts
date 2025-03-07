import { EventEmitterHandler } from '@/app/domain/event-emitter-handler'
import { NestEventEmitterHandler } from '@/app/infrastructure/nest-event-emitter-handler'
import { routes } from '@/config/app.routes'
import { AuthMiddleware } from '@/contexts/v1/user/infrastructure/middleware/auth.middleware'
import { EventsModule } from '@/contexts/v1/real-time/application/events/events.module'
import { RealTimeModule } from '@/contexts/v1/real-time/real-time.module'
import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { CacheModule } from './cache.module'
import { CompositeLogger } from './domain/logger/composite-logger.service'
import { HttpModule } from './http.module'
import { HealthController } from './infrastructure/health.controller'
import { LoggingModule } from './logging.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getDatabaseConfig } from './database/database.config'
import { UserModule } from '@/contexts/v1/user/user.module'
import { TodoModule } from '@/contexts/v1/todos/todo.module'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (
        getDatabaseConfig(configService)
      )
    }),
    CacheModule,
    LoggingModule,
    EventEmitterModule.forRoot(),
    HttpModule,
    RealTimeModule,
    EventsModule,
    UserModule,
    TodoModule
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: EventEmitterHandler,
      useClass: NestEventEmitterHandler
    },
    CompositeLogger
  ],
  exports: [
    {
      provide: EventEmitterHandler,
      useClass: NestEventEmitterHandler
    },
    CompositeLogger
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      version: routes.v1.version,
      path: routes.v1.helloWorld.root,
      method: RequestMethod.ALL
    })
  }
}
