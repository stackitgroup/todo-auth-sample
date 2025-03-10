import { NODE_ENV } from '@/app/env.config'
import { JWTBody } from '@/contexts/v1/users/domain/jwt-body'
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserService } from '../../application/user.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}
  async use(req: FastifyRequest, reply: FastifyReply, next: () => void) {
    if (NODE_ENV === 'test') {
      return next()
    }
    
    const accessToken = req.headers.authorization?.split(' ')[1]
    const headerUserAgentId = req.headers['user-agent']

    if (!accessToken) {
      throw new UnauthorizedException('Access Token is missing')
    }

    if (!headerUserAgentId) {
      throw new UnauthorizedException('user-agent header is missing')
    }

    try {
      const {
        userAgentId,
        userId
      }: JWTBody =
      await this.jwtService.verifyAsync(accessToken)
      
      if (userAgentId !== headerUserAgentId) {
        await this.userService.clearUserCredentials(userId)
        throw new UnauthorizedException()
      }
      
      next()
    } catch (error: unknown) {
      console.log('error', error)
      const tokenExpiredName = 'TokenExpiredError'
      const jwtErrorName = 'JsonWebTokenError'
      if (error instanceof Error) {
        if (error.name === tokenExpiredName) {
          throw new UnauthorizedException('Access Token has expired')
        }
        if (error.name === jwtErrorName) {
          throw new UnauthorizedException('Access Token is invalid')
        }
      }
      if (error instanceof UnauthorizedException) {
        throw error
      }
      console.error('Error Verifying Access Token:', error)
      throw new BadRequestException('Invalid access token request')
    }
  }
}
