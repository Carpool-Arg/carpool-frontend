import { TripStat } from "../types/TripsStat";

export function mapFilterToOrderBy(filter: string): string {
  switch (filter) {
    case "7d":
      return "WEEK";
    case "month":
      return "MONTH";
    case "year":
      return "YEAR";
    default:
      return "MONTH"; // fallback razonable
  }
}

type Stat = {
  label: string
  value: number
}

export function mapTripStatToChartData(tripStat: TripStat | null): Stat[] {
  if (!tripStat) return [];

  return tripStat.historialByPeriod.map(item => ({
    label: item.label,
    value: item.value,
  }));
}