import { constants } from '@/contexts/shared/domain/constants/zod-validations'
import { z } from 'zod'

export const numberFieldValidation = (min?: number, max?: number) =>
  z.preprocess(
    (input) => {
      if (input === '' || input === null) return undefined

      const parsed = Number(input)

      if (isNaN(parsed)) return undefined

      return parsed
    },
    z
      .number()
      .gte(min ?? Number.MIN_SAFE_INTEGER, constants.ERROR_MESSAGE_MIN_LENGTH)
      .lte(max ?? Number.MAX_SAFE_INTEGER, constants.ERROR_MESSAGE_MAX_LENGTH)
  )

export const optionalNumberFieldValidation = () =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val === '' || val === undefined ? undefined : Number(val)
    )

export const stringValidation = () => z.coerce.string()

export const booleanValidation = () => z.coerce.boolean()
