import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'
import { PaginationRequestDto } from '@/app/dto/pagination-request.dto'
import { PaginationResponse } from '@/app/dto/pagination-response'
import { BaseEntity } from '@/libs/ddd/base.entity'
import { RepositoryPort } from '@/app/database/repository.port'
import { BadRequestException } from '@nestjs/common'

export abstract class BaseRepository<T extends BaseEntity> implements RepositoryPort<T> {
  constructor(private readonly repository: Repository<T>) {}

  public findAll(options?: {
    relations?: string[]
    order?: FindOptionsOrder<T>
    where?: FindOptionsWhere<T>
  }): Promise<T[]> {
    return this.repository.find(options ?? {})
  }

  public findByCondition(
    {
      condition,
      relations,
      select,
      order,
    }: {
      condition: FindOptionsWhere<T>
      relations?: string[]
      select?: string
      order?: FindOptionsOrder<T>
    } = {
      condition: {},
      order: { id: 'ASC' } as FindOptionsOrder<T>,
    }
  ): Promise<T[]> {
    const fields = (select?.split(',') as (keyof T)[]) ?? []
    return this.repository.find({
      relations: fields?.length > 1 ? relations : [],
      where: condition,
      order,
      select: fields,
    })
  }

  public async findAllPaginated(
    { limit, page, search, sort, order, select }: PaginationRequestDto,
    searchFields?: string[],
    relations?: string[],
    where?: FindOptionsWhere<T>
  ): Promise<PaginationResponse<T>> {
    const hasLimit = limit ?? undefined
    const skip = (page - 1) * (limit ?? 1)
    const whereClause: FindOptionsWhere<T>[] = [
      this.buildPaginationConditions(search, searchFields),
      where,
    ] as FindOptionsWhere<T>[]

    const optionsOrder = this.buildFindOptionsOrder(sort, order)
    const findOptions: FindManyOptions<T> = {
      where: whereClause,
      take: hasLimit,
      skip,
      order: optionsOrder,
      relations,
      select: select?.split(',') as (keyof T)[],
    }

    const [data, count] = await this.repository.findAndCount(findOptions)
    const { totalPages, nextPage, prevPage } = this.getPagesInfo(count, page, hasLimit)

    return {
      data,
      count,
      limit: hasLimit,
      page: Number(page),
      totalPages,
      nextPage,
      prevPage,
    }
  }

  public async findById(
    id: string,
    relations?: string[],
    where?: FindOptionsWhere<T>
  ): Promise<T | null> {
    const options: FindOneOptions<T> = {}
    if (relations) {
      options.relations = relations
    }

    const entities = await this.repository.find({
      where: { id: id as any, ...where } as FindOptionsWhere<T>,
      ...options,
    })
    return entities.length > 0 ? entities[0] : null
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data)

    return this.repository.save(entity)
  }

  public async update(id: string, data: Partial<unknown>): Promise<T | null> {
    await this.repository.update(id, { ...data, id } as Partial<unknown>)
    return this.findById(id)
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  private buildPaginationConditions(
    search: string | undefined,
    searchFields?: string[]
  ): FindOptionsWhere<T>[] {
    const conditions: FindOptionsWhere<T>[] = []

    if (search && searchFields) {
      searchFields.forEach((field) => {
        const condition: FindOptionsWhere<T> = {}
        condition[field] = ILike(`%${search}%`)
        conditions.push(condition)
      })
    }

    return conditions
  }

  private buildFindOptionsOrder(sort?: string, order?: string): FindOptionsOrder<T> | undefined {
    const orderOptions: FindOptionsOrder<T> | undefined = sort
      ? ({
          [sort]: order?.toUpperCase() as 'ASC' | 'DESC',
        } as FindOptionsOrder<T>)
      : undefined

    return orderOptions
  }

  public getPagesInfo(count: number, page: number, limit: number) {
    const totalPages = Math.ceil(count / limit)
    const nextPage = Number(page) < totalPages ? Number(page) + 1 : null
    const prevPage = Number(page) > 1 ? Number(page) - 1 : null
    return { totalPages, nextPage, prevPage }
  }

  public createQueryBuilder(alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias, queryRunner)
  }
}
