import { AuthRepository } from '../domain/auth.repository'
import { RefreshRequestDto } from '../domain/refresh-request.dto'
import { useAuthStore } from '../infrastructure/auth.store'
import { HttpAuthRepository } from '../infrastructure/http-auth.repository'
import Cookie from 'js-cookie'

export const AuthService = (repository: AuthRepository) => {
  if (repository === undefined) {
    throw new Error(
      'Repository is undefined. Please check if the repository is initialized correctly.'
    )
  }

  return {
    refreshTokens: async (dto: RefreshRequestDto): Promise<void> => {
      await repository.refresh(dto)

      const accessToken = Cookie.get('accessToken')

      useAuthStore.setState({ userId: dto.userId, userAccessToken: accessToken })
    },

    create: async (dto: RefreshRequestDto): Promise<void> => {
      await repository.create(dto)

      const accessToken = Cookie.get('accessToken')

      useAuthStore.setState({ userId: dto.userId, userAccessToken: accessToken })
    }
  }
}

export const authService = AuthService(new HttpAuthRepository())
