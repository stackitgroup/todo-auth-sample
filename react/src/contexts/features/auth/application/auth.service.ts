import { AccessDTO } from '../domain/access.dto'
import { AuthRepository } from '../domain/auth.repository'
import { RefreshRequestDto } from '../domain/refresh-request.dto'
import { User } from '../domain/user'
import { toast } from 'sonner'
import { AuthState, useAuthStore } from '../infrastructure/auth.store'
import { HttpAuthRepository } from '../infrastructure/http-auth.repository'
import {jwtDecode} from 'jwt-decode'
import Cookie from 'js-cookie'
import { JWTBody } from '../domain/jwt-body'

export const isTokenExpired = (decodedToken: JWTBody & {exp: number, iat: number}) => {
  if (!decodedToken || !decodedToken.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decodedToken.exp < now;
};

export const AuthService = (repository: AuthRepository) => {
  if (repository === undefined) {
    throw new Error(
      'Repository is undefined. Please check if the repository is initialized correctly.'
    )
  }

  return {
    refreshTokens: async (): Promise<void> => {
      const user = useAuthStore((s) => s.user)

      if(!user) {
        toast.error("Something went wrong | REFRESH")
        useAuthStore.setState({ userAccessToken: "", isAuthenticated: false })
        return;
      }

      await repository.refresh({userId: user.id})

      const accessToken = Cookie.get('accessToken')

      useAuthStore.setState({ userAccessToken: accessToken, isAuthenticated: true })
    },
    authenticate: (): void => {
      const accessToken = Cookie.get('accessToken')
      const user = useAuthStore((s: AuthState) => s.user)

      if(!user) {
        return
      }

      if(!accessToken) {
        useAuthStore.setState({ isAuthenticated: false, userAccessToken: '', user: null })
        Cookie.remove('refreshToken')
        return;
      }

      try {
        const decoded : JWTBody & {exp: number, iat: number} = jwtDecode(accessToken)
        let isAuthenticated = false
        
        if(decoded.userId === user.id && decoded.userAgentId === navigator.userAgent) {
          isAuthenticated = true
        }
        
        if (isTokenExpired(decoded)) {
          isAuthenticated = false
          useAuthStore.setState({ user: null, userAccessToken: "" })
        }

        useAuthStore.setState({ isAuthenticated })
      } catch (error) {
        toast.error("Authentication failed.")
      }
    },
    logOut: async (user: User | null): Promise<void> => {
      if(!user) return

      useAuthStore.setState({ userAccessToken: "", isAuthenticated: false, user: null })
      await repository.logOut(user.id)
      Cookie.remove('accessToken')
      Cookie.remove('refreshToken')
      window.location.href = "/access"
    },
    logIn: async (dto: AccessDTO): Promise<void> => {
      try {
        const response = await repository.logIn(dto)
  
        const accessToken = Cookie.get('accessToken')
  
        useAuthStore.setState({ userAccessToken: accessToken, isAuthenticated: true, user: response })

        window.location.href = "/"
      } catch (error) {
        toast.error("Something went wrong")
      }
    },
    signUp: async (dto: AccessDTO): Promise<void> => {
      const response = await repository.signUp(dto)

      const accessToken = Cookie.get('accessToken')

      useAuthStore.setState({ userAccessToken: accessToken, isAuthenticated: true, user: response })
    }
  }
}

export const authService = AuthService(new HttpAuthRepository())
