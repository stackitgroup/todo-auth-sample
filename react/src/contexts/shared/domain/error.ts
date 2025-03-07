export interface ExceptionResponseBase {
  name: string
  message: string
  error?: any
}

export interface ExceptionResponse extends ExceptionResponseBase {
  path?: string
  timestamp?: string
  correlationId?: string
  code: number
}

export interface ValidationError {
  target?: Record<string, any>
  property: string
  value?: any
  constraints?: Record<string, string>
  children?: ValidationError[]
  contexts?: Record<string, any>
}

export interface ErrorType {
  code: string
  message: string
}

export interface ValidationResponse extends ExceptionResponse {
  details?: ValidationError[]
}

export type CustomErrorType = Record<string, ErrorType>
