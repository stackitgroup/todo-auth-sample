import { HttpService } from '@/contexts/shared/infrastructure/http-service'
import { AuthRepository } from '../domain/auth.repository'
import { RefreshRequestDto } from '../domain/refresh-request.dto'
import { User } from '../domain/user'
import { AccessDTO } from '../domain/access.dto'

export class HttpAuthRepository extends HttpService implements AuthRepository {
  constructor() {
    super()
    this.serviceUrl = '/v1/user'
  }

  async refresh(dto: RefreshRequestDto): Promise<void> {
    await this.request<void>({
      url: '/auth',
      options: {
        method: 'POST',
        body: JSON.stringify(dto)
      }
    })
  }

  async getUserById(id: string): Promise<User> {
    return await this.request<User>({
      url: `/${id}`,
      options: {
        method: 'GET'
      }
    })
  }

  async signUp(dto: AccessDTO): Promise<User> {
    return await this.request<User>({
      url: "/signup",
      options: {
        method: 'POST',
        body: JSON.stringify(dto)
      }
    })
  }

  async logIn(dto: AccessDTO): Promise<User> {
    return await this.request<User>({
      url: "/login",
      options: {
        method: 'POST',
        body: JSON.stringify(dto)
      }
    })
  }

  async logOut(id: string): Promise<void> {
    await this.request<void>({
      url: `/logout/${id}`,
      options: {
        method: 'POST',
        body: JSON.stringify({})
      }
    })
  }
}
