import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { CompositeLogger } from '../domain/logger/composite-logger.service'

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CompositeLogger) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse() as Record<string, string>

    this.logger.error(
      JSON.stringify({
        message: exception.message,
        error: exceptionResponse.message || exceptionResponse,
        statusCode: status
      })
    )

    response.status(status).send({
      statusCode: status,
      message: exceptionResponse.message || exceptionResponse,
      error: 'Bad Request'
    })
  }
}
