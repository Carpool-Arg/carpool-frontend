'use client'

import { CircleDashed, MapPin, MapPinHouse, TrendingDown, TrendingUp } from "lucide-react"

import StatCard from "../StatCard"
import { TopCityCard } from "./TopCityCard"

import { useTopOrigin } from "../../hooks/trip/useTopCity"
import { useCompletedTrips } from "../../hooks/trip/useCompletedTrips"
import { formatPercentageDelta, getStatusDelta } from "../../helpers/stats"
import { usePublishedTrips } from "../../hooks/trip/usePublishedTrips"
import { useSeatsPercentage } from "../../hooks/trip/useSeatsPercentage"
import { SectionProps } from "../generals/GeneralSection"
import { formatFilterLabel, formatFilterLabelPrevious, getPreviousRangeForFilter, getRangeForFilter } from "@/modules/activity/helpers/stats"
import { formatLocalDate } from "@/shared/utils/date"
import DashboardSeparator from "../DashboardSeparator"
import { StatCardSkeleton } from "../skeletons/StatCardSkeleton"
import { useState } from "react"
import { capitalize } from "@/shared/utils/string"



export default function TripSection({filter, customRange}:SectionProps) {
  const [limitOrigin, setLimitOrigin] = useState(3)
  const [limitDestination, setLimitDestination] = useState(3)
  const { from: fromDate, to: toDate } =
    filter === "custom" && customRange?.from && customRange?.to
      ? {
          from: customRange.from,
          to: customRange.to,
        }
      : getRangeForFilter(filter)
  
  const {
    from: previousFromDate,
    to: previousToDate,
  } = getPreviousRangeForFilter(
    filter,
    fromDate,
    toDate
  )

  
  const {
    topOrigin,
    topDestination,
    loading: topLoading,
    error,
  } = useTopOrigin(limitOrigin, limitDestination)

  

  const {
    filtered: filteredSeats,
    previousPeriod: previousPeriodSeats,
    delta: deltaSeats,
    loading: loadingSeats, 
    error: errorSeats
  } = useSeatsPercentage(
    formatLocalDate(fromDate), 
    formatLocalDate(toDate),
    formatLocalDate(previousFromDate),
    formatLocalDate(previousToDate)
  );

  const { 
    filtered: filteredTrips,
    previousPeriod: previousPeriodTrips,
    delta: deltaTrips, 
    error: errorTrips, 
    loading: loadingTrips
  } = useCompletedTrips(
    formatLocalDate(fromDate), 
    formatLocalDate(toDate),
    formatLocalDate(previousFromDate),
    formatLocalDate(previousToDate)
  );

  const {
    filtered: filteredPublished, 
    previousPeriod: previousPeriodPublished,
    delta: deltaPublished,
    error: errorPublished, 
    loading: loadingPublished
  } = usePublishedTrips(
    formatLocalDate(fromDate), 
    formatLocalDate(toDate),
    formatLocalDate(previousFromDate),
    formatLocalDate(previousToDate)
  )

  const globalLoading = loadingPublished || loadingTrips || loadingSeats
  
  const seatsStatus = getStatusDelta(
    deltaSeats?? 0, 
    previousPeriodSeats?.takenPercentageFiltered ?? 0
  )
  const seatsDeltaPercentage = formatPercentageDelta(
    deltaSeats?? 0, 
    previousPeriodSeats?.takenPercentageFiltered ?? 0
  )

  const tripsStatus = getStatusDelta(
    deltaTrips ?? 0, 
    previousPeriodTrips?.totalFiltered ?? 0
  )
  const tripsDeltaPercentage = formatPercentageDelta(
    deltaTrips ?? 0, 
    previousPeriodTrips?.totalFiltered ?? 0
  )


  const publishedStatus = getStatusDelta(deltaPublished ?? 0, previousPeriodPublished?.totalFiltered ?? 0)
  const publishedDeltaPercentage = formatPercentageDelta(
    deltaPublished ?? 0, 
    previousPeriodPublished?.totalFiltered ?? 0
  )
  
  return (
    <div className="space-y-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {globalLoading ?
          <>
            <StatCardSkeleton/>
            <StatCardSkeleton/>
            <StatCardSkeleton/>
          </>
        :
          <>
            <StatCard
              title="Viajes publicados"
              value={`${filteredPublished?.totalFiltered}`}
              description={capitalize(formatFilterLabel(filter))}
              icon={ 
                publishedStatus === 'increase' || 
                publishedStatus === 'new' ? (
                  <TrendingUp size={18} />
                ) : publishedStatus === 'decrease' ? (
                  <TrendingDown size={18} />
                ) : (
                  <CircleDashed size={14} />
                )
              }
              trend={
                <span>
                  <span className="font-medium">
                    {publishedStatus === 'increase' || publishedStatus === 'new' ? '+' :  ''}
                    {publishedStatus === 'new' ? 
                      `${publishedDeltaPercentage}` : 
                      `${publishedDeltaPercentage}%`}
                  </span>
                  {' '}
                  {!globalLoading && formatFilterLabelPrevious(filter)}
                </span>
              }
              variant={publishedStatus}
            />
            <StatCard
              title="Viajes completados"
              value={`${filteredTrips?.totalFiltered ?? 0}`}
              description="Últimos 30 días"
              icon={
                tripsStatus === 'increase' || tripsStatus === 'new' ? (
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
                    {tripsStatus === 'increase' || tripsStatus === 'new' ? '+' :  ''}
                    {tripsStatus === 'new' ? 
                      `${tripsDeltaPercentage}` : 
                      `${tripsDeltaPercentage}%`}
                  </span>
                  {' '}
                  {formatFilterLabelPrevious(filter)}
                </span>
              }
              variant={tripsStatus}
            />
            <StatCard
              title="Ocupación total"
              value={`${filteredSeats?.takenPercentageFiltered}%`}
              description="Este mes"
              icon={
                seatsStatus === 'increase' || seatsStatus === 'new' ? (
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
                    {seatsStatus === 'increase' || seatsStatus === 'new' ? '+' :  ''}
                    
                      {seatsDeltaPercentage}%
                  </span>
                  {' '}
                  {formatFilterLabelPrevious(filter)}
                </span>
              }
              variant={seatsStatus}
            />
          </>
        }
        
      </div>
      
      <DashboardSeparator 
        title="Preferencias de viaje"
        desc="Datos históricos no afectados por el filtro seleccionado"
      />
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <TopCityCard
          title="Origen más elegido"
          desc={`Entre ${topOrigin?.totalReservationsCount} viajes realizados`}
          icon={MapPin}
          cities={topOrigin?.cities ?? []}
          loading={topLoading}
          error={error}
          limit={limitOrigin}
          onLimitChange={setLimitOrigin}
        />

        <TopCityCard
          title="Destino más elegido"
          desc={`Entre ${topOrigin?.totalReservationsCount} viajes realizados`}
          icon={MapPinHouse}
          cities={topDestination?.cities ?? []}
          loading={topLoading}
          error={error}
          limit={limitDestination}
          onLimitChange={setLimitDestination}
        />
      </div>
    </div>
  )
}