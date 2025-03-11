import { AccessDTO } from "./access.dto";
import { RefreshRequestDto } from "./refresh-request.dto";
import { User } from "./user";

export abstract class AuthRepository {
  getUserById: (id: string) => Promise<User>
  refresh: (dto: RefreshRequestDto) => Promise<void>
  signUp: (dto: AccessDTO) => Promise<User>
  logIn: (dto: AccessDTO) => Promise<User>
  logOut: (id: string) => Promise<void>
}
