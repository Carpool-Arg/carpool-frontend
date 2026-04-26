'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { useDriversPercentage } from "../../hook/useDriversPercentage"
import BarChartFilters from "@/modules/activity/components/barchart/BarChartFilters"
import DriversPercentage from "./DriversPercentage"

function getDateRange(filter: string, range?: DateRange): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString().split("T")[0]

  if (filter === "custom" && range?.from && range?.to) {
    return {
      from: range.from.toISOString().split("T")[0],
      to: range.to.toISOString().split("T")[0],
    }
  }

  const from = new Date(now)
  switch (filter) {
    case "7d":    from.setDate(now.getDate() - 7); break
    case "month": from.setDate(1); break
    case "year":  from.setFullYear(now.getFullYear() - 1); break
    default:      from.setDate(now.getDate() - 7)
  }

  return { from: from.toISOString().split("T")[0], to }
}

export default function UserSection() {
  const [filter, setFilter] = useState("7d")
  const [range, setRange] = useState<DateRange | undefined>()

  const { from, to } = getDateRange(filter, range)

  const { data, loading, error } = useDriversPercentage(from, to)

  return (
    <div className="grid gap-4">
      <Card className="bg-gray-8 border-gray-2/50 rounded-2xl w-1/2">
        <CardContent className="p-0">

          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-9/20">
            <div className="p-2.5 bg-gray-10/60 border border-gray-9/20 rounded-xl">
              <Users size={18} className="text-gray-11" />
            </div>
            <div>
              <h2 className="font-semibold text-base leading-tight">
                Distribución de usuarios
              </h2>
              <p className="text-xs text-gray-11 mt-0.5">
                Conductores vs pasajeros
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="px-5 pt-4">
            <BarChartFilters
              selected={filter}
              onChange={setFilter}
              range={range}
              onRangeChange={setRange}
            />
          </div>

          {/* Body */}
          <div className="px-5 py-6">
            <DriversPercentage
              driverPercentage={data?.driverPercentage ?? 0}
              loading={loading}
              error={error}
            />
          </div>

        </CardContent>
      </Card>
    </div>
  )
}