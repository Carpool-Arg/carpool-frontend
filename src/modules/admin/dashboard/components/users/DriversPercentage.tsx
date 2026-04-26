'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface DriversPercentageProps {
  driverPercentage: number
  loading: boolean
  error: string | null
}

const COLORS = {
  drivers: "#e5e5e5",   // blanco roto — conductores
  passengers: "#3f3f3f", // gris oscuro — pasajeros
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-gray-8 border border-gray-2/50 rounded-xl px-3 py-2 text-sm shadow-lg">
      <p className="text-white font-medium">{payload[0].name}</p>
      <p className="text-gray-11">{payload[0].value}%</p>
    </div>
  )
}

export default function DriversPercentage({
  driverPercentage,
  loading,
  error,
}: DriversPercentageProps) {
  const passengerPercentage = Math.round((100 - driverPercentage) * 10) / 10

  const data = [
    { name: "Conductores", value: driverPercentage },
    { name: "Pasajeros", value: passengerPercentage },
  ]

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {loading ? (
        <div className="w-40 h-40 rounded-full bg-gray-9/40 animate-pulse" />
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-gray-11">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {error}
        </div>
      ) : (
        <>
          {/* Gráfico */}
          <div className="relative w-44 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={index === 0 ? COLORS.drivers : COLORS.passengers}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-semibold text-white leading-none">
                {driverPercentage}%
              </p>
              <p className="text-xs text-gray-11 mt-1">conductores</p>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex items-center gap-5">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: index === 0 ? COLORS.drivers : COLORS.passengers }}
                />
                <span className="text-xs text-gray-11">{entry.name}</span>
                <span className="text-xs text-white font-medium tabular-nums">
                  {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}