'use client'

import { useTopOrigin } from "../../hook/useTopCity"
import { TopCityCard } from "./TopCityCard"


export default function TripSection() {
  const {
    topOrigin,
    topDestination,
    loading,
    error,
  } = useTopOrigin()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TopCityCard
        title="Ciudad con más salidas"
        desc='Top origen'
        cities={topOrigin?.cities ?? []}
        loading={loading}
        error={error}
      />

      <TopCityCard
        title="Ciudad con más destinos"
        desc='top destinos'
        cities={topDestination?.cities ?? []}
        loading={loading}
        error={error}
      />
    </div>
  )
}