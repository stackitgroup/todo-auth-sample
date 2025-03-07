import { TODO } from '@/contexts/shared/domain/types/todo'

export const timeToDate = (time: string) => {
  if (time) {
    const [hour, minutes] = time.split(':')
    const today = new Date()
    today.setHours(Number(hour))
    today.setMinutes(Number(minutes))
    today.setSeconds(0)
    return today
  }
  return undefined
}

export const minutesBetweenDates = (startDate?: Date, endDate?: Date) => {
  if (!(startDate && endDate)) {
    return 0
  }
  const dif = endDate.getTime() - startDate.getTime()
  return Math.round(dif / 1000 / 60)
}

type NestedObject = { [key: string]: TODO }

export const objectify = (obj: NestedObject) => {
  const result: NestedObject = {}
  for (const key in obj) {
    if (key) {
      let target: NestedObject = result
      const parts = key.split('.')
      for (let j = 0; j < parts.length - 1; j += 1) {
        const part = parts[j]
        target[part] ||= {}
        target = target[part]
      }
      target[parts[parts.length - 1]] = obj[key]
    }
  }
  return result
}

export const isNumber = (value: string | boolean | number) =>
  typeof value === 'number'
