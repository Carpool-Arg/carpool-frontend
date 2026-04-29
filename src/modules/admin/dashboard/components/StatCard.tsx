'use client'

import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: ReactNode
  variant?: "default" | "increase" | "decrease" | "custom" | "new"
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
}: StatCardProps) {
  
  return (
    <div className={`bg-gray-8 rounded-2xl`}>
      <div className="px-6 py-3 flex flex-col gap-1">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base text-gray-11 ">
            {title}
          </h3>

          {icon && 
            <div 
              className={` 
                ${variant === "increase" || variant === "new" ?
                  'text-green-300' 
                : (variant === 'decrease' ? 
                  'text-red-300'
                : (variant === 'default' ? 
                  'text-gray-11/60':
                  '')
                ) }
              `}
            >
            {icon}
          </div>}
        </div>

        {/* Value */}
        <div className="text-2xl font-bold">
          {value}
        </div>

        {/* Footer */}
        {(description || trend) && (
          <div className="flex items-center justify-between text-xs text-gray-11 truncate gap-2">
            <span>{description}</span>
            {trend && <div className={` truncate
              ${variant === "increase" || variant === "new"  ? 'text-green-400' : (variant === 'decrease' ? 'text-red-400':'text-gray-11') }`}>
              {trend}
            </div>}
          </div>
        )}
      </div>
    </div>
  )
}