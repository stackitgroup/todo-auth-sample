import { DeepPartial } from 'typeorm'
import { BaseEntity } from '@/libs/ddd/base.entity'
import { PaginationResponse } from '@/app/dto/pagination-response'

export interface RepositoryPort<T extends BaseEntity> {
  findAll(): Promise<T[]>
  findAllPaginated(PaginationRequestDto, searchFields: string[]): Promise<PaginationResponse<T>>
  findById(id: string): Promise<T | null>
  create(data: DeepPartial<T>): Promise<T>
  update(id: string, data: Partial<unknown>): Promise<T | null>
  delete(id: string): Promise<void>
}
