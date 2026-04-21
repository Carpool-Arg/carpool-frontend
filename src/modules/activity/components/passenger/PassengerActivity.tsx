'use client'


import { Car, Route } from 'lucide-react'
import BarChartCard from '../BarChartCard'
import SavedCO2 from './SavedCO2Card'

export const DATA_PASSENGER = {
  totalKilometers: 1248,
  completedTrips: 87,
  savedCO2Kg: 156.4,
}

const kmData = {
  '7d': [
    { month: 'Lun', label: 'Lunes', value: 22 },
    { month: 'Mar', label: 'Martes', value: 35 },
  ],

  month: [
    { month: 'Sem1', label: 'Semana 1', value: 120 },
    { month: 'Sem2', label: 'Semana 2', value: 180 },
    { month: 'Sem3', label: 'Semana 3', value: 140 },
    { month: 'Sem4', label: 'Semana 4', value: 210 },
  ],

  '90d': [
    { month: 'Ene', label: 'Enero', value: 260 },
    { month: 'Feb', label: 'Febrero', value: 338 },
    { month: 'Mar', label: 'Marzo', value: 290 },
  ],

  year: [
    { month: 'Jan', label: 'Enero', value: 120 },
    { month: 'Feb', label: 'Febrero', value: 180 },
    { month: 'Mar', label: 'Marzo', value: 140 },
    { month: 'Apr', label: 'Abril', value: 210 },
    { month: 'May', label: 'Mayo', value: 260 },
    { month: 'Jun', label: 'Junio', value: 338 },
  ],
}

const tripData = {
  '7d': [
    { month: 'Lun', label: 'Lunes', value: 2 },
    { month: 'Mar', label: 'Martes', value: 4 },
    { month: 'Mié', label: 'Miércoles', value: 3 },
    { month: 'Jue', label: 'Jueves', value: 5 },
    { month: 'Vie', label: 'Viernes', value: 6 },
    { month: 'Sáb', label: 'Sábado', value: 4 },
    { month: 'Dom', label: 'Domingo', value: 7 },
  ],

  month: [
    { month: 'Sem1', label: 'Semana 1', value: 10 },
    { month: 'Sem2', label: 'Semana 2', value: 8 },
    { month: 'Sem3', label: 'Semana 3', value: 14 },
    { month: 'Sem4', label: 'Semana 4', value: 12 },
    { month: 'Sem5', label: 'Semana 5', value: 16 },
  ],

  year: [
    { month: 'Ene', label: 'Enero', value: 12 },
    { month: 'Feb', label: 'Febrero', value: 10 },
    { month: 'Mar', label: 'Marzo', value: 22 },
    { month: 'Abr', label: 'Abril', value: 16 },
    { month: 'May', label: 'Mayo', value: 25 },
    { month: 'Jun', label: 'Junio', value: 20 },
    { month: 'Jul', label: 'Julio', value: 1 },
    { month: 'Ago', label: 'Agosto', value: 24 },
    { month: 'Sep', label: 'Septiembre', value: 30 },
    { month: 'Oct', label: 'Octubre', value: 26 },
    { month: 'Nov', label: 'Noviembre', value: 5 },
    { month: 'Dic', label: 'Diciembre', value: 36 },
  ],
}



export default function PassengerActivity() {
  return (
    <div className='space-y-6'>
      <SavedCO2/>

      <BarChartCard 
        title="Viajes realizados"
        desc={`Realizaste en total ${DATA_PASSENGER.completedTrips} viajes como pasajero`}
        icon={Car} 
        data={tripData}
      />

      <BarChartCard 
        title="Kilometros recorridos"
        desc={`Realizaste en total ${DATA_PASSENGER.totalKilometers} km`}
        icon={Route} 
        data={kmData}
      />

      
      
    </div>
  )
}
