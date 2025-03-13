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
import { navigate } from 'wouter/use-browser-location'
import { tenMinutesExpiration } from '@/contexts/shared/domain/constants/jwt-constants'
import { config } from '@/contexts/shared/domain/constants/config'

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
    refreshTokens: async (user: User | null): Promise<void> => {
      if(!user) {
        toast.error("Something went wrong | REFRESH")
        useAuthStore.setState({ userAccessToken: "", isAuthenticated: false })
        return;
      }

      try {
        const response = await repository.refresh({userId: user.id})
       
        const accessToken = response.accessToken
        
        Cookie.set('accessToken', accessToken, {
          expires: tenMinutesExpiration,
          httpOnly: false,
          secure: false,
          sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/'
        })
  
        useAuthStore.setState({ userAccessToken: accessToken, isAuthenticated: true })
      } catch (error) {
        toast.error(`${error}`)
      }
    },
    verifyTokens: async (user: User | null, accessToken: string) => {
      if(!user) {
        return
      }

      const accessTokenCookie = Cookie.get('accessToken')

      if(!accessTokenCookie) {
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
          const response = await repository.refresh({userId: user.id})
          const accessToken = response.accessToken
          Cookie.set('accessToken', accessToken, {
            expires: 3650, // 10 years
            httpOnly: false,
            secure: false,
            sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: '/'
          })
          isAuthenticated = true

          useAuthStore.setState({ user, userAccessToken: accessToken })
        }
        useAuthStore.setState({ isAuthenticated })
      } catch (error) {
        toast.error("Authentication failed.")
      }
    },
    authenticate: (user : User | null, accessToken: string): void => {
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
      
      navigate("/access")
    },
    logIn: async (dto: AccessDTO): Promise<void> => {
      try {
        const response = await repository.logIn(dto)

        const {accessToken, ...rest} = response
        
        Cookie.set('accessToken', accessToken, {
          expires: tenMinutesExpiration,
          httpOnly: false,
          secure: false,
          sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/'
        })

        if(!accessToken) {
          throw new Error("Access Token Not Found")
        }
  
        useAuthStore.setState({ userAccessToken: accessToken, isAuthenticated: true, user: rest })

        navigate("/")
      } catch (error) {
        toast.error(`${error}`)
      }
    },
    signUp: async (dto: AccessDTO): Promise<void> => {
      try {
        const response = await repository.signUp(dto)
  
        const {accessToken, ...rest} = response
        
        Cookie.set('accessToken', accessToken, {
          expires: tenMinutesExpiration,
          httpOnly: false,
          secure: false,
          sameSite: config.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/'
        })

        if(!accessToken) {
          throw new Error("Access Token Not Found")
        }
  
        useAuthStore.setState({ userAccessToken: accessToken, isAuthenticated: true, user: rest })
        
        navigate("/")
      } catch (error) {
        toast.error(`${error}`)
      }
    }
  }
}

export const authService = AuthService(new HttpAuthRepository())
