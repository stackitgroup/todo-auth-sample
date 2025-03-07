import { RefreshRequestDto } from "./refresh-request.dto";

export abstract class AuthRepository {
  refresh: (dto: RefreshRequestDto) => Promise<void>
  create: (dto: RefreshRequestDto) => Promise<void>
}
