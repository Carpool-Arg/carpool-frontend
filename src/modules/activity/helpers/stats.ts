import { PassengerStat } from "../types/PassengerStat";

export function mapFilterToOrderBy(filter: string): string {
  switch (filter) {
    case "7d":
      return "DAY";
    case "month":
      return "WEEK";
    case "year":
      return "MONTH";
    default:
      return "MONTH"; 
  }
}

type Stat = {
  label: string
  value: number
}

export function mapTripStatToChartData(tripStat: PassengerStat | null): Stat[] {
  if (!tripStat) return [];

  return tripStat.historialByPeriod.map(item => ({
    label: item.label,
    value: item.value,
  }));
}

export function getDynamicGroupBy(from: Date, to: Date) {
  const diffMs = to.getTime() - from.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  const diffMonths =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())

  const diffYears = to.getFullYear() - from.getFullYear()

  if (diffDays < 7) return "DAY"
  if (diffDays < 31) return "WEEK"
  if (diffYears >= 1) return "YEAR"

  return "MONTH"
}

function parseLocalDate(label: string): Date {
  const separator = label.includes("/") ? "/" : "-"

  const [day, month, year] = label
    .split(separator)
    .map(Number)

  return new Date(year, month - 1, day)
}

export function formatLabelByGroup(
  label: string,
  groupBy: "DAY" | "WEEK" | "MONTH" | "YEAR"
): string {
  const currentYear = new Date().getFullYear()

  const monthShort = (date: Date) =>
    date
      .toLocaleDateString("es-AR", {
        month: "short",
      })
      .replace(".", "")

  switch (groupBy) {
    case "DAY": {
      const date = parseLocalDate(label)

      const day = date.getDate()
      const month = monthShort(date)
      const year = date.getFullYear()

      return year === currentYear
        ? `${day} ${month}`
        : `${day} ${month} ${year}`
    }

    case "WEEK": {
      const start = parseLocalDate(label)
      const end = new Date(start)

      end.setDate(start.getDate() + 6)

      const startDay = start.getDate()
      const endDay = end.getDate()

      const startMonth = monthShort(start)
      const endMonth = monthShort(end)

      const year = start.getFullYear()

      if (startMonth === endMonth) {
        return year === currentYear
          ? `${startDay}-${endDay} ${startMonth}`
          : `${startDay}-${endDay} ${startMonth} ${year}`
      }

      return year === currentYear
        ? `${startDay} ${startMonth} - ${endDay} ${endMonth}`
        : `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`
    }

    case "MONTH": {
      const [month, year] = label.split("/").map(Number)

      const date = new Date(year, month - 1)

      return monthShort(date)
    }

    case "YEAR": {
      return label
    }

    default:
      return label
  }
}

export type GroupByType = "DAY" | "WEEK" | "MONTH" | "YEAR"

export function formatChartData<T extends { label: string }>(
  data: T[] = [],
  groupBy: GroupByType
): T[] {
  return data.map((item) => ({
    ...item,
    label: formatLabelByGroup(item.label, groupBy),
  }))
}