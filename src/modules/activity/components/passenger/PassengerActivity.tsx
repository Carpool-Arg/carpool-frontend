'use client'

import { useState } from "react";
import { Car } from "lucide-react";
import BarChartCard from "../BarChartCard";
import SavedCO2 from "./SavedCO2Card";
import { getRangeForFilter } from "../agregateData";
import { useTripsStats } from "../../hooks/passenger/useTripsStats";
import { mapFilterToOrderBy } from "../../helpers/stats";

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
}


export default function PassengerActivity() {
  const [tripFilter, setTripFilter] = useState("month");

  const { from, to } = getRangeForFilter(tripFilter);
  
 
  const { data, loading } = useTripsStats(formatLocalDate(from),  formatLocalDate(to), mapFilterToOrderBy(tripFilter));

  return (
    <div className="space-y-6">
      <SavedCO2 />

      <BarChartCard
        title="Viajes realizados"
        desc="Total de viajes como pasajero"
        icon={Car}
        data={data?.historialByPeriod ?? []}
        loading={loading}
        filter={tripFilter}
        onFilterChange={setTripFilter}
        unit="viajes"
      />
    </div>
  );
}