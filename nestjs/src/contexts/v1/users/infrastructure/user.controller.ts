import { routes } from '@/config/app.routes'
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  Req,
  Res,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common'
import { User } from '../domain/entities/user.entity'
import { UserService } from '../application/user.service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { fifteenDaysExpiration } from '@/config/constants'
import { NODE_ENV } from '@/app/env.config'
import { AccessDTO } from './dto/access.dto'

@Controller({
  version: routes.v1.version,
  path: routes.v1.user.root
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers()
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.getUserById(id)
  }

  @Post(routes.v1.user.register)
  async signup(
    @Headers('User-Agent') userAgent: string,
    @Body() data: AccessDTO,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply
  ): Promise<void> {
    if (!userAgent) {
      throw new UnauthorizedException('User-Agent header is missing')
    }

    const signUpResponse = await this.userService.signUp({ ...data, userAgent })

    if (!signUpResponse) {
      throw new BadRequestException('Invalid credentials')
    }

    const { id, username, accessToken, refreshToken } = signUpResponse

    // res.setCookie('accessToken', accessToken, {
    //   expires: tenMinutesExpiration,
    //   httpOnly: false,
    //   secure: false,
    //   sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
    //   path: '/'
    // })

    res.setCookie('refreshToken', refreshToken, {
      expires: fifteenDaysExpiration,
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/'
    })

    res.status(200).send({ id, username, accessToken })
  }

  @Post(routes.v1.user.login)
  async login(
    @Headers('User-Agent') userAgent: string,
    @Body() data: AccessDTO,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply
  ): Promise<void> {
    if (!userAgent) {
      throw new UnauthorizedException('User-Agent header is missing')
    }

    const logInResponse = await this.userService.logIn({ ...data, userAgent })

    if (!logInResponse) {
      res.status(400)
      throw new BadRequestException('Invalid credentials')
    }

    const { id, username, refreshToken, accessToken } = logInResponse

    // res.setCookie('accessToken', accessToken, {
    //   expires: tenMinutesExpiration,
    //   httpOnly: false,
    //   secure: false,
    //   sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
    //   path: '/'
    // })

    res.setCookie('refreshToken', refreshToken, {
      expires: fifteenDaysExpiration,
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/'
    })

    res.status(200).send({ id, username, accessToken })
  }

  @Post(routes.v1.user.auth)
  async refreshTokens(
    @Headers('User-Agent') userAgentId: string,
    @Headers('Authorization') authHeader: string,
    @Body() body: { userId: string },
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply
  ) {
    const { refreshToken: refreshTokenCookie } =
      req.cookies
    
    const accessTokenHeader = authHeader.split(' ')[1]
    
    if (!accessTokenHeader) {
      throw new UnauthorizedException('Access Token cookie is missing')
    }

    if (!refreshTokenCookie) {
      throw new UnauthorizedException('Refresh Cookie token is missing')
    }

    if (!userAgentId) {
      throw new UnauthorizedException('User-Agent header is missing')
    }

    const { accessToken, refreshToken } = await this.userService.refreshTokens(
      refreshTokenCookie,
      userAgentId,
      body.userId
    )

    // res.setCookie('accessToken', accessToken, {
    //   expires: new Date(Date.now() + 10 * 60 * 1000),
    //   httpOnly: false,
    //   secure: false,
    //   sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
    //   path: '/'
    // })

    res.setCookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/'
    })

    res
      .status(200)
      .send({ status: 200, accessToken, message: 'Refresh successful' })
  }

  @Post(routes.v1.user.logout)
  async logout(
    @Headers('User-Agent') userAgentId: string,
    @Param('id') id: string,
    @Res() res: FastifyReply
  ) {
    if (!userAgentId) {
      throw new UnauthorizedException('User-Agent header is missing')
    }

    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')

    await this.userService.logOut(id, userAgentId)

    res.status(200)
  }
}
