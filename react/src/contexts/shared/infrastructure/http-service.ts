import { API_URL } from '../domain/constants/api-url'
import { ValidationResponse } from '../domain/error'
import { TODO } from '../domain/types/todo'
import { LocalStorageService } from './local-storage-service'
import { TokenService } from './token-service'

export abstract class HttpService {
  protected token?: string
  protected baseUrl = API_URL
  protected serviceUrl: `/${string}` = '/'
  protected localStorageService: LocalStorageService
  pendingRequests = new Map()

  private tokenService = new TokenService(new LocalStorageService())

  protected request<Response>({
    url,
    options = {}
  }: {
    url: `/${string}` | `?${string}`
    version?: `/${string}`
    options?: RequestInit
  }): Promise<Response> {
    options.headers = new Headers({
      ...options.headers,
      'User-Agent': navigator.userAgent
    })

    if (
      options.method &&
      ['POST', 'PUT', 'PATCH'].includes(options.method.toLocaleUpperCase())
    ) {
      options.headers.set('Content-Type', 'application/json')
    }

    const key = this.generateKey(url, options)

    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)
    }

    const promise = fetch(`${this.baseUrl}${this.serviceUrl}${url}`, {
      ...options,
      method: options.method || 'GET',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          const responseError = (await response.json()) as ValidationResponse
          if (response.status === 401) throw new Error(response.statusText)
          const msg = this.handleBusinessError(responseError)

          throw new Error(msg)
        }

        if (response.status === 204) return undefined

        // The cookies get updated automatically

        return response.json()
      })
      .finally(() => {
        this.pendingRequests.delete(key)
      })

    this.pendingRequests.set(key, promise)

    return promise
  }

  generateKey(url: TODO, options: TODO) {
    const { method = 'GET', body } = options
    return `${method}:${url}:${JSON.stringify(body || '')}`
  }

  private handleBusinessError(data: ValidationResponse): string {
    let msg = `${data.message} `

    if (data.details) {
      for (const detail of data.details) {
        let constraintsSrg = ''

        if (!detail.constraints) continue

        for (const key of Object.keys(detail.constraints)) {
          constraintsSrg = `${constraintsSrg}
        - ${String(detail.constraints?.[key])} `
        }
        msg = `${msg} ${constraintsSrg} `
      }
    }

    return msg
  }
}
