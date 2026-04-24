'use client'

import { useState } from "react";
import { Car } from "lucide-react";
import BarChartCard from "../BarChartCard";
import SavedCO2 from "./SavedCO2Card";
import { getRangeForFilter } from "../agregateData";
import { useTripsStats } from "../../hooks/passenger/useTripsStats";
import { formatChartData, formatLabelByGroup, getDynamicGroupBy, GroupByType, mapFilterToOrderBy } from "../../helpers/stats";
import { DateRange } from "react-day-picker";
import { useKmStats } from "../../hooks/passenger/useKmStats";
import { useCO2Stats } from "../../hooks/passenger/useCO2Stats";

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
}


export default function PassengerActivity() {
  const [tripFilter, setTripFilter] = useState("month");
  const [tripCustomRange, setTripCustomRange] = useState<DateRange>()

  const [kmFilter, setKmFilter] = useState("month");
  const [kmCustomRange, setKmCustomRange] = useState<DateRange>()


  const { from, to } =
  tripFilter === "custom" && tripCustomRange?.from && tripCustomRange?.to
    ? {
        from: tripCustomRange.from,
        to: tripCustomRange.to,
      }
    : getRangeForFilter(tripFilter)
  
  const groupBy =
  tripFilter === "custom"
    ? getDynamicGroupBy(from, to)
    : mapFilterToOrderBy(tripFilter)
 
  const { data: tripData, loading: loadingTrip } = useTripsStats(
    formatLocalDate(from),  
    formatLocalDate(to), 
    groupBy.toUpperCase()
  );

  const { data: kmData, loading: loadingKm } = useKmStats(
    formatLocalDate(from),  
    formatLocalDate(to), 
    groupBy.toUpperCase()
  );

  const {data: CO2Data, loading: loadingCO2} = useCO2Stats()

  const formattedTrips = formatChartData(
    tripData?.historialByPeriod,
    groupBy as GroupByType
  )

  const formattedKm = formatChartData(
    kmData?.historialByPeriod,
    groupBy as GroupByType
  )

  return (
    <div className="space-y-6">
      <SavedCO2 
        totalSaved={Number(CO2Data?.totalCo2Saved) ?? 0}
        loading={loadingCO2}
      />

      <BarChartCard
        title="Viajes realizados"
        desc={
          <>
            Hiciste un total de{" "}
            <span className="font-semibold">
              {tripData?.historialTotal} viajes
            </span>{" "}
          </>
        }
        icon={Car}
        data={formattedTrips ?? []}
        loading={loadingTrip}
        filter={tripFilter}
        onFilterChange={setTripFilter}
        customRange={tripCustomRange}
        onCustomRangeChange={setTripCustomRange}
        unit="viajes"
      />

      <BarChartCard
        title="Kilómetros recorridos"
        desc={
          <>
            Recorriste un total de{" "}
            <span className="font-semibold">
              {(kmData?.historialTotal)?.toFixed(2)} kilómetros
            </span>{" "}
          </>
        }
        icon={Car}
        data={formattedKm ?? []}
        loading={loadingKm}
        filter={kmFilter}
        onFilterChange={setKmFilter}
        customRange={kmCustomRange}
        onCustomRangeChange={setKmCustomRange}
        unit="km"
      />
    </div>
  );
}