'use client'


import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Leaf, MapPinned, Car } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import SavedCO2 from './SavedCO2Card'
import BarChartCard from '../BarChartCard'

export const DATA_PASSENGER = {
  totalKilometers: 1248,
  completedTrips: 87,
  savedCO2Kg: 156.4,
}

const kmData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 180 },
  { month: 'Mar', value: 140 },
  { month: 'Apr', value: 210 },
  { month: 'May', value: 260 },
  { month: 'Jun', value: 338 },
]

const tripData = [
  { month: 'Jan', value: 8 },
  { month: 'Feb', value: 10 },
  { month: 'Mar', value: 12 },
  { month: 'Apr', value: 15 },
  { month: 'May', value: 18 },
  { month: 'Jun', value: 24 },
]



export default function PassengerActivity() {
  return (
    <div className='space-y-6'>
      <SavedCO2/>

      <BarChartCard 
        title={`Viajes realizados - ${DATA_PASSENGER.completedTrips}`} 
        icon={Car} 
        data={tripData}
      />

      <BarChartCard 
        title={`Kilometros recorridos - ${DATA_PASSENGER.totalKilometers}km`} 
        icon={MapPinned} 
        data={kmData} 
      />
      
      
    </div>
  )
}
