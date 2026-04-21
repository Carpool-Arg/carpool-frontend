'use client'

import { formatShortDate, formatShortDateText, formatShortDateTextWithYear, formatShortDateWithYear } from "@/shared/utils/date"
import { ChevronRight } from "lucide-react"

const FILTERS = [
  { label: 'Últimos 7 días', value: '7d' },
  { label: 'Último mes', value: 'month' },
  { label: 'Último año', value: 'year' },
]

type Props = {
  selected: string
  onChange: (value: string) => void
}

export default function BarChartFilters({ selected, onChange }: Props) {
  const now = new Date()

  const from = new Date(now)

  switch (selected) {
    case '7d':
      from.setDate(now.getDate() - 7)
      break

    case 'month':
      from.setDate(1)
      break

    case '90d':
      from.setDate(now.getDate() - 90)
      break

    case 'year':
      from.setFullYear(now.getFullYear() - 1)
      break

    default:
      from.setDate(1)
  }

  const showYear = selected === 'year'

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-center">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`px-2 md:px-3 py-1.5 border rounded-xl text-xs md:text-sm duration-200 ease-out cursor-pointer ${
              selected === filter.value
                ? 'bg-white border-white text-black font-medium'
                : ' border-gray-2 hover:bg-gray-2'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-11 flex items-center justify-center mt-4 gap-1">
        {showYear
          ? formatShortDateTextWithYear(from)
          : formatShortDateText(from)}

        {' - '}

        {showYear
          ? formatShortDateTextWithYear(now)
          : formatShortDateText(now)}
        
      </div>
    </div>
  )
}