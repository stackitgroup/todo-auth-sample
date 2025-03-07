import { HttpService as AxiosHttpService } from '@nestjs/axios'
import { Global, Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '../domain/http-service'

@Global()
@Injectable()
export class NestHttpService implements HttpService {
  constructor(private readonly axiosHttpService: AxiosHttpService) {}

  async get<T>(url: string): Promise<{ data: T; status: number }> {
    const { data, status } = await firstValueFrom(
      this.axiosHttpService.get<T>(url)
    )

    return { data, status }
  }

  async post<T>(
    url: string,
    payload?: unknown
  ): Promise<{ data: T; status: number }> {
    const { data, status } = await firstValueFrom(
      this.axiosHttpService.post<T>(url, payload)
    )

    return { data, status }
  }
}
