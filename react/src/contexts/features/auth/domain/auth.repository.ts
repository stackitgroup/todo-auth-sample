import { AccessDTO } from "./access.dto";
import { RefreshRequestDto } from "./refresh-request.dto";
import { User } from "./user";

export abstract class AuthRepository {
  getUserById: (id: string) => Promise<User>
  refresh: (dto: RefreshRequestDto) => Promise<{status: number, message: string, accessToken: string}>
  signUp: (dto: AccessDTO) => Promise<User & {accessToken: string}>
  logIn: (dto: AccessDTO) => Promise<User & {accessToken: string}>
  logOut: (id: string) => Promise<void>
}
