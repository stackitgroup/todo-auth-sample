import { constants } from '@/config/constants'
import { Type } from 'class-transformer'
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
  ValidateIf,
} from 'class-validator'

export class PaginationRequestDto {
  @IsNumber()
  @IsOptional()
  @Min(constants.pagination.defaultLimit)
  @Max(constants.pagination.defaultMaxLimit)
  @Type(() => Number)
  limit: number

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(constants.pagination.defaultPage)
  @Type(() => Number)
  page: number

  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((p) => Boolean(p.search))
  search?: string

  @IsOptional()
  @IsNotEmpty()
  sort?: string

  @IsOptional()
  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  order?: string

  @IsOptional()
  @IsNotEmpty()
  select?: string
}
