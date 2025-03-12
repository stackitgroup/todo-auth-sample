import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { UserRepository } from '../infrastructure/persistence/user.repository'
import { User } from '../domain/entities/user.entity'
import { NODE_ENV } from '@/app/env.config'
import bcrypt from 'bcryptjs'
import { AccessDTO } from '../infrastructure/dto/access.dto'
import { JwtService } from '@nestjs/jwt'
import { JWTBody } from '../domain/jwt-body'
import { RefreshResponse } from '../domain/refresh-response'

@Injectable()
export class UserService {
  protected salt = ''

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {
    this.salt = bcrypt.genSaltSync(10)
  }

  async getUserById(id: string): Promise<User | null> {
    const found = await this.userRepository.findById(id)

    if (!found) {
      throw new NotFoundException(`Id ${id} not found`)
    }

    return this.userRepository.findById(id)
  }

  async getAllUsers(): Promise<User[]> {
    if (NODE_ENV === 'development' || NODE_ENV === 'test') {
      return await this.userRepository.findAll()
    }

    return []
  }

  async logOut(userId: string, userAgent: string): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if(!user) {
      throw new NotFoundException(`User ID ${userId} not found`)
    }

    if(user.userAgent !== userAgent) {
      throw new UnauthorizedException()
    }

    return await this.clearUserCredentials(userId)
  }

  async signUp(
    data: AccessDTO & { userAgent: string }
  ): Promise<User & { accessToken: string; refreshToken: string }> {
    const alreadyExists = (
      await this.userRepository.findByCondition({
        condition: { username: data.username }
      })
    )

    if (alreadyExists.length > 0) {
      throw new ConflictException(`User "${data.username}" already exists`)
    }

    const hashedPassword = await bcrypt.hash(data.password, this.salt)

    const createdUser = await this.userRepository.create({
      username: data.username,
      password: hashedPassword,
      userAgent: data.userAgent,
      refreshToken: null
    })

    const { accessToken, refreshToken } = await this.createTokens(
      data.userAgent,
      createdUser.id
    )

    createdUser.refreshToken = refreshToken

    return Object.assign(createdUser, { accessToken, refreshToken })
  }

  async logIn(
    data: AccessDTO & { userAgent: string }
  ): Promise<(User & RefreshResponse) | null> {
    const found: User = (
      await this.userRepository.findByCondition({
        condition: { username: data.username }
      })
    )[0]

    if (!found) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(data.password, found.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Passwords do not match.')
    }

    await this.userRepository.update(found.id, {
      userAgent: data.userAgent
    })

    const tokens = await this.createTokens(data.userAgent, found.id)

    const response: User & RefreshResponse = Object.assign(found, tokens)

    return response
  }

  async update(userId: string, data: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`)
    }

    return await this.userRepository.update(userId, data)
  }

  async refreshTokens(
    refreshToken: string,
    userAgentId: string,
    userId: string
  ): Promise<RefreshResponse> {
    try {
      const haveSameUserAgent: boolean = await this.haveSameUserAgent(
        userAgentId,
        userId
      )
      const haveSameRefreshToken: boolean = await this.haveSameRefreshToken(
        refreshToken,
        userId
      )

      if(haveSameRefreshToken === false || haveSameUserAgent === false) {
        throw new UnauthorizedException(
          `Wrong credentials. Provided: ${JSON.stringify({ userAgentId, refreshToken })}`
        )
      }

      const newRefreshToken = await this.generateRefreshToken({
        userAgentId,
        userId
      })

      await this.userRepository.update(userId, {
        refreshToken: newRefreshToken,
        userAgent: userAgentId
      })

      const newAccessToken = await this.generateAccessToken({
        userAgentId,
        userId
      })

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  async createTokens(
    userAgentId: string,
    userId: string
  ): Promise<RefreshResponse> {
    try {
      const newRefreshToken = await this.generateRefreshToken({
        userAgentId,
        userId
      })

      await this.userRepository.update(userId, {
        refreshToken: newRefreshToken
      })

      const newAccessToken = await this.generateAccessToken({
        userAgentId,
        userId
      })

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  async haveSameUserAgent(userAgent: string, userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} does not exist`)
    }

    return user.userAgent === userAgent
  }

  async haveSameRefreshToken(
    refreshToken: string,
    userId: string
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} does not exist`)
    }

    return user.refreshToken === refreshToken
  }

  async clearUserCredentials(userId: string) : Promise<User> {
    return await this.userRepository.update(userId, 
      {
        refreshToken: null, 
        userAgent: null
      }
    )
  }

  private async generateAccessToken(payload: JWTBody) {
    return await this.jwtService.signAsync(payload, { expiresIn: '10m' })
  }

  private async generateRefreshToken(payload: JWTBody) {
    return await this.jwtService.signAsync(payload, { expiresIn: '15d' })
  }
}
