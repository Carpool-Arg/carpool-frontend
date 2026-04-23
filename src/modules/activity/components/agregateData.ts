// aggregateData.ts
import { DataPoint } from './mockData'
import { format, startOfWeek, startOfMonth, startOfYear, isWithinInterval } from 'date-fns'
import { DateRange } from 'react-day-picker'

type Granularity = 'day' | 'week' | 'month'

function pickGranularity(from: Date, to: Date): Granularity {
  const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays <= 14) return 'day'
  if (diffDays <= 90) return 'week'
  return 'month'
}

export function aggregateByRange(raw: DataPoint[], from: Date, to: Date) {
  const granularity = pickGranularity(from, to)

  const filtered = raw.filter(d =>
    isWithinInterval(d.date, { start: from, end: to })
  )

  const buckets = new Map<string, { label: string; value: number }>()

  filtered.forEach(d => {
    let key: string
    let label: string

    if (granularity === 'day') {
      key = format(d.date, 'yyyy-MM-dd')
      label = format(d.date, 'dd MMM')
    } else if (granularity === 'week') {
      const ws = startOfWeek(d.date, { weekStartsOn: 1 })
      key = format(ws, 'yyyy-MM-dd')
      label = format(ws, 'dd MMM')
    } else {
      key = format(d.date, 'yyyy-MM')
      label = format(d.date, 'MMM yyyy')
    }

    const existing = buckets.get(key)
    if (existing) {
      existing.value += d.value
    } else {
      buckets.set(key, { label, value: d.value })
    }
  })

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, { label, value }]) => ({
      month: label,
      label,
      value,
      date: new Date(key),
    }))
}

export function getRangeForFilter(filter: string): { from: Date; to: Date } {
  const now = new Date()
  switch (filter) {
    case '7d':   return { from: subDays(now, 7), to: now }
    case 'month': return { from: startOfMonth(now), to: now }
    case 'year':
      return {
        from: new Date(now.getFullYear(), 0, 1),
        to: now
      }
    default:     return { from: startOfMonth(now), to: now }
  }
}

// imports faltantes
import { subDays, subYears } from 'date-fns'