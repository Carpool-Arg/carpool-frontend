'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { LucideIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import BarChartFilters from "./BarChartFilters"
import { DataPoint } from "./mockData"
import { aggregateByRange, getRangeForFilter } from "./agregateData"


interface BarChartCardProps {
  title: string
  desc?: string
  icon: LucideIcon
  rawData: DataPoint[]
  unit?: string
}

function CustomTooltip({ active, payload, unit }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="bg-gray-8/98 border border-gray-7 rounded-xl p-3">
      <p className="text-xs text-gray-11">{item.label}</p>
      <p className="text-sm font-medium text-white">{item.value} {unit}</p>
    </div>
  )
}

export default function BarChartCard({ title, desc, icon: Icon, rawData, unit = 'viajes' }: BarChartCardProps) {
  const [filter, setFilter] = useState("month")
  const [customRange, setCustomRange] = useState<DateRange | undefined>()

  const { from, to } = filter === 'custom' && customRange?.from && customRange?.to
    ? { from: customRange.from, to: customRange.to }
    : getRangeForFilter(filter)

  const chartData = aggregateByRange(rawData, from, to)

  return (
    <Card className="bg-gray-8 border-gray-2/50 rounded-2xl shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-3 bg-gray-10/60 border border-gray-9/20 rounded-lg flex items-center justify-center">
              <Icon size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="font-medium text-lg leading-tight mb-0.5">{title}</h1>
              {desc && <p className="text-xs text-gray-11/80 leading-none">{desc}</p>}
            </div>
          </div>
        </div>

        <BarChartFilters
          selected={filter}
          onChange={setFilter}
          range={customRange}
          onRangeChange={setCustomRange}
        />

        <div className="h-60 py-2 px-2 mt-4 transition-all duration-300 [&_*:focus]:outline-none [&_*:focus]:ring-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={`${filter}-${from.getTime()}`}
              data={chartData}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              barCategoryGap="15%"
            >
              <XAxis dataKey="month" stroke="#c9c9c9" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <YAxis stroke="#c9c9c9" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                content={<CustomTooltip unit={unit} />}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#ffffff" isAnimationActive animationDuration={450} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}