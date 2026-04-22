'use client'

import { Car, Route } from 'lucide-react'
import BarChartCard from '../BarChartCard'
import SavedCO2 from './SavedCO2Card'
import { RAW_KM_DATA, RAW_TRIP_DATA } from '../mockData'

export const DATA_PASSENGER = {
  totalKilometers: 1248,
  completedTrips: 87,
  savedCO2Kg: 156.4,
}

export default function PassengerActivity() {
  return (
    <div className='space-y-6'>
      <SavedCO2 />

      <BarChartCard
        title="Viajes realizados"
        desc="Total de viajes como pasajero"
        icon={Car}
        rawData={RAW_TRIP_DATA}
        unit="viajes"
      />

      <BarChartCard
        title="Kilómetros recorridos"
        icon={Route}
        rawData={RAW_KM_DATA}
        unit="km"
      />
    </div>
  )
}