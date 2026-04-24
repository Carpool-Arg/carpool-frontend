'use client'

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Stat } from "../types/Stat"
import { getRangeForFilter } from "./agregateData"
import BarChartFilters from "./BarChartFilters"


interface BarChartCardProps {
  title: string
  desc?: React.ReactNode
  icon: LucideIcon
  data: Stat[]
  loading: boolean
  filter: string
  onFilterChange: (value: string) => void
  customRange?: DateRange
  onCustomRangeChange: (range: DateRange | undefined) => void
  unit?: string
}

function CustomTooltip({ active, payload, unit}: any) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="bg-gray-8/98 border border-gray-7 rounded-xl p-3">
      <p className="text-xs text-gray-11">{item.label}</p>
      <p className="text-sm font-medium text-white">{(item.value).toFixed(2)} {unit}</p>
    </div>
  )
}

export default function BarChartCard({ 
  title, 
  desc, 
  icon: Icon, 
  data, 
  unit = 'viajes', 
  filter, 
  onFilterChange,
  customRange,
  onCustomRangeChange,
  loading,
}: BarChartCardProps) {
  

  const { from, to } = filter === 'custom' && customRange?.from && customRange?.to
    ? { from: customRange.from, to: customRange.to }
    : getRangeForFilter(filter)


  

  const isSingleBar = data.length === 1


  return (
    <Card className="bg-gray-8 border-gray-2/50 rounded-2xl shadow-lg w-full">
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
          onChange={onFilterChange}
          range={customRange}
          onRangeChange={onCustomRangeChange}
        />

        <div className="h-60 py-2 px-2 mt-4 transition-all duration-300 [&_*:focus]:outline-none [&_*:focus]:ring-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={`${filter}-${from.getTime()}`}
              data={data}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              barCategoryGap="15%"
            > 
              <XAxis
                dataKey="label"
                stroke="#c9c9c9"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                padding={{
                  left: isSingleBar ? 80 : 0,
                  right: isSingleBar ? 80 : 0,
                }}
                ticks={loading ? [] : undefined}
              />
              
              <YAxis
                stroke="#c9c9c9"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.05)]}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                content={<CustomTooltip unit={unit} />}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                fill="#ffffff"
                barSize={isSingleBar ? 80 : undefined}
                isAnimationActive
                animationDuration={450}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}