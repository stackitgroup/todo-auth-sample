export class PaginationResponse<T> {
  readonly count: number
  readonly limit?: number
  readonly page: number
  readonly totalPages: number
  readonly nextPage: number | null
  readonly prevPage: number | null
  readonly data: readonly T[]

  constructor(props: PaginationResponse<T>) {
    this.count = props.count
    this.limit = props.limit
    this.page = props.page
    this.totalPages = props.totalPages
    this.nextPage = props.nextPage
    this.prevPage = props.prevPage
    this.data = props.data
  }
}
