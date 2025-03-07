import { HttpService } from '@/contexts/shared/infrastructure/http-service'
import { AuthRepository } from '../domain/auth.repository'
import { RefreshRequestDto } from '../domain/refresh-request.dto'

export class HttpAuthRepository extends HttpService implements AuthRepository {
  constructor() {
    super()
    this.serviceUrl = '/v1/auth'
  }

  async refresh(dto: RefreshRequestDto): Promise<void> {
    await this.request<void>({
      url: '/refresh',
      options: {
        method: 'POST',
        body: JSON.stringify(dto)
      }
    })
  }

  async create(dto: RefreshRequestDto): Promise<void> {
    await this.request<void>({
      url: '/create',
      options: {
        method: 'POST',
        body: JSON.stringify(dto)
      }
    })
  }
}
