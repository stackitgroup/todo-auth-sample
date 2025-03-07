import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

export const CORRELATION_ID_HEADER = 'x-correlation-id'
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const id = crypto.randomUUID()
    req.headers[CORRELATION_ID_HEADER] = id
    res.setHeader(CORRELATION_ID_HEADER, id)

    next()
  }
}
