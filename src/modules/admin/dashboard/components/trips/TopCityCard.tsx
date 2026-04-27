'use client'

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, MapPin, TrendingUp } from "lucide-react"
import { TopCityStat } from "../../types/topCity"

interface TopCityCardProps {
  title: string
  desc: string
  cities: TopCityStat[]
  loading: boolean
  error: string | null
  icon: LucideIcon
}

export function TopCityCard({ title, desc, cities, loading, error, icon: Icon }: TopCityCardProps) {
  const maxReservations = cities[0]?.reservationCount || 1

  return (
    <div className="bg-gray-8  rounded-2xl overflow-hidden">
      <div className="p-0 min-h-55 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-2/40">
          <div className="p-2.5 bg-gray-10/60 border border-gray-9/20 rounded-xl">
            <Icon size={18} className="text-gray-11" />
          </div>
          <div>
            <h2 className="font-semibold text-base leading-tight">{title}</h2>
            {!loading && !error && cities.length > 0 && (
              <p className="text-xs text-gray-11 mt-0.5">
                {desc}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-3.5 bg-gray-9/40 rounded w-28" />
                    <div className="h-3.5 bg-gray-9/40 rounded w-16" />
                  </div>
                  <div className="h-1.5 bg-gray-9/40 rounded-full w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-sm text-gray-11">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          ) : cities.length === 0 ? (
            <p className="text-sm text-gray-11">No hay datos disponibles</p>
          ) : (
            <div className="space-y-4">
              {cities.map((city, index) => {
                const percentage = Math.round(
                  (city.reservationCount / maxReservations) * 100
                )
                const isTop = index === 0

                return (
                  <div key={`${city.cityName}-${index}`} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`text-xs font-mono shrink-0 w-4 text-right ${
                            isTop ? "text-white" : "text-gray-11"
                          }`}
                        >
                          {index + 1}
                        </span>
                        <p
                          className={`text-sm truncate ${
                            isTop ? "text-white font-semibold" : "text-gray-12 font-medium"
                          }`}
                        >
                          {city.cityName}
                        </p>
                        {isTop && (
                          <TrendingUp size={12} className="text-green-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-11 shrink-0 tabular-nums">
                        {city.reservationCount.toLocaleString()} viajes
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-4 shrink-0" /> {/* spacer for index alignment */}
                      <div className="flex-1 h-1.5 bg-gray-10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isTop ? "bg-white" : "bg-gray-11/60"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-11/60 w-8 text-right tabular-nums">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}