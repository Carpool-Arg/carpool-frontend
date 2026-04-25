import {LucideIcon } from "lucide-react"

export interface BarChartHeaderProps {
  title: string
  desc?: React.ReactNode
  icon: LucideIcon
}
export default function BarChartHeader({
  title,
  desc,
  icon: Icon,
}: BarChartHeaderProps) {
  return(
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
  )
}