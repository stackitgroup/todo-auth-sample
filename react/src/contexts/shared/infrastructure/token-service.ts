import Cookie from 'js-cookie'
import { LocalStorageService } from './local-storage-service'

export class TokenService {
  constructor(private readonly localStorageService: LocalStorageService) {}

  getToken(): string {
    const accessToken = Cookie.get('accessToken')
    if (!accessToken) return ''

    return accessToken
  }
  
}

export const tokenService = new TokenService(new LocalStorageService())
