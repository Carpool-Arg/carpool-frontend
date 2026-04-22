// mockData.ts
import { subDays, subMonths, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format, startOfWeek, endOfWeek, startOfMonth } from 'date-fns'

export interface DataPoint {
  month: string   // label del eje X
  label: string   // label del tooltip
  value: number
  date: Date      // fecha real para filtrar
}

// Genera N días de datos aleatorios hacia atrás desde hoy
function generateDailyData(days: number): DataPoint[] {
  const today = new Date()
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(today, days - 1 - i)
    return {
      month: format(date, 'dd/MM'),
      label: format(date, 'EEEE dd MMM', { locale: undefined }),
      value: Math.floor(Math.random() * 10) + 1,
      date,
    }
  })
}

// Todos los datos diarios del último año
export const RAW_TRIP_DATA: DataPoint[] = generateDailyData(365)
export const RAW_KM_DATA: DataPoint[] = generateDailyData(365).map(d => ({
  ...d,
  value: d.value * 12 + Math.floor(Math.random() * 20),
}))