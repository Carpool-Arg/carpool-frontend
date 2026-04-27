'use client'

import { CircleDashed, MapPin, MapPinHouse, TrendingDown, TrendingUp } from "lucide-react"

import StatCard from "../StatCard"
import { TopCityCard } from "./TopCityCard"
import { useSeatsAnalytics } from "../../hooks/trip/useSeatsPercentage"
import { useTopOrigin } from "../../hooks/trip/useTopCity"
import { useCompletedTrips } from "../../hooks/general/useCompletedTrips"
import { formatPercentageDelta, getStatusDelta } from "../../helpers/stats"



export default function TripSection() {
  const limit = 3
  const {
    topOrigin,
    topDestination,
    loading,
    error,
  } = useTopOrigin(limit)

  const fromDate = '01-04-2026'
  const toDate = '26-04-2026'

  const {
    currentMonth: currentMonthSeats, 
    previousMonth: previousMonthSeats, 
    filtered: filteredSeats,
    delta: deltaSeats,
    loading: loadingSeats, 
    error: errorSeats
  } = useSeatsAnalytics(fromDate, toDate);

  const {
    currentMonth: currentMonthTrips, 
    previousMonth : previousMonthTrips, 
    filtered: filteredTrips,
    delta: deltaTrips, 
    error: errorTrips, 
    loading: loadingTrips
  } = useCompletedTrips(fromDate, toDate);
  
  const seatsStatus = getStatusDelta(deltaSeats ?? 0)
  const seatsDeltaPercentage = formatPercentageDelta(
    deltaSeats?? 0, 
    previousMonthSeats?.takenPercentageFiltered ?? 0
  )
  

  const tripsStatus = getStatusDelta(deltaTrips ?? 0)
  const tripsDeltaPercentage = formatPercentageDelta(
    deltaTrips ?? 0, 
    previousMonthTrips?.totalFiltered ?? 0
  )
  
  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Viajes publicados"
          value="1203"
          description="Últimos 30 días"
          icon={<TrendingUp size={18} />}
          trend={<span className="text-green-500">+4% vs anterior</span>}
          variant="default"
        />
        <StatCard
          title="Viajes completados"
          value={`${currentMonthTrips?.totalFiltered ?? 0}`}
          description="Últimos 30 días"
          icon={
            tripsStatus === 'increase' ? (
              <TrendingUp size={18} />
            ) : tripsStatus === 'decrease' ? (
              <TrendingDown size={18} />
            ) : (
              <CircleDashed size={14} />
            )
          }
          trend={
            <span>
              <span className="font-medium">
                {tripsStatus === 'increase' ? '+' :  ''}
                {tripsDeltaPercentage}% 
              </span>
              {' '}
              respecto mes anterior
            </span>
            }
          variant={tripsStatus}
        />
        <StatCard
          title="Ocupación total"
          value={`${currentMonthSeats?.takenPercentageFiltered}%`}
          description="Este mes"
          icon={
            seatsStatus === 'increase' ? (
              <TrendingUp size={18} />
            ) : seatsStatus === 'decrease' ? (
              <TrendingDown size={18} />
            ) : (
              <CircleDashed size={14} />
            )
          }
          trend={
            <span>
              <span className="font-medium">
                {seatsStatus === 'increase' ? '+' :  ''}
                {seatsDeltaPercentage}% 
              </span>
              {' '}
              respecto mes anterior
            </span>
            }
          variant={seatsStatus}
        />
      </div>
      
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <TopCityCard
          title="Origen más elegido"
          desc={`Entre ${topOrigin?.totalReservationsCount} viajes realizados`}
          icon={MapPin}
          cities={topOrigin?.cities ?? []}
          loading={loading}
          error={error}
        />

        <TopCityCard
          title="Destino más elegido"
          desc={`Entre ${topOrigin?.totalReservationsCount} viajes realizados`}
          icon={MapPinHouse}
          cities={topDestination?.cities ?? []}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}