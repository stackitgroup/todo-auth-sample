import { AppModule } from '@/app/app.module'
import fastifyCookie from '@fastify/cookie'
import { VERSION_NEUTRAL, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { ClusterService } from './app/clustering.service'
import { CompositeLogger } from './app/domain/logger/composite-logger.service'
import { NODE_ENV, PORT } from './app/env.config'
import { ValidationExceptionFilter } from './app/infrastructure/validation-exception-filter.pipe'

process.on('uncaughtException', (err) => {
  console.error('Error not handled:', err)
})

process.on('unhandledRejection', (reason) => {
  console.error('Promise not handled:', reason)
})

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true }
  )

  await app.register(fastifyCookie, {
    secret: 'my-secret-key',
    parseOptions: {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict'
    }
  })

  const logger = app.get(CompositeLogger)
  app.useLogger(logger)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  })

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'User-Agent-Id',
      'X-CSRF-Token',
      'x-user-email',
      'x-building-id',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Authorization', 'accessToken'],
    maxAge: 600
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: false,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  app.useGlobalFilters(new ValidationExceptionFilter(logger))

  await app.listen({ port: PORT, host: '0.0.0.0' }, async () => {
    logger.log(`Server started on ${process.pid}`)
    logger.log(`Server started on ${await app.getUrl()}`)
  })
}

ClusterService.clusterize(bootstrap)
