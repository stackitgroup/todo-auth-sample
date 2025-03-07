import { HttpService } from '@/contexts/shared/infrastructure/http-service'
import { HelloWorldRepository } from '../domain/hello-world.repository'

export class HttpHelloWorldRepository
  extends HttpService
  implements HelloWorldRepository
{
  constructor() {
    super()
    this.serviceUrl = '/v1/hello-world'
  }

  async ping() {
    await this.request({ url: '/sample' })
  }
}
