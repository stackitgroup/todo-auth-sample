export abstract class HttpService {
  abstract post<T>(
    url: string,
    payload: unknown
  ): Promise<{ data: T; status: number }>

  abstract get<T>(url: string): Promise<{ data: T; status: number }>
}
