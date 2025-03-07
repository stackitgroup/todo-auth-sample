export class LocalStorageService {
  getItem<T>(key: string): T | null {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key)

        return item ? (JSON.parse(item) as T) : null
      }

      return null
    } catch {
      return null
    }
  }

  getItemRaw(key: string): string | null {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key)
        return item || null
      }

      return null
    } catch {
      return null
    }
  }

  setItem<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }

  removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
  }

  setItemRaw(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value)
    }
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
    }
  }
}
export const localStorageService = new LocalStorageService()
