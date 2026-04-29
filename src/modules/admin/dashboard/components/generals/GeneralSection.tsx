import { formatFilterLabel, formatFilterLabelPrevious, getPreviousRangeForFilter, getRangeForFilter } from "@/modules/activity/helpers/stats";
import { formatLocalDate } from "@/shared/utils/date";
import { formatPrice } from "@/shared/utils/number";
import { capitalize } from "@/shared/utils/string";
import { CircleDashed, Leaf, TrendingDown, TrendingUp } from "lucide-react";
import { DateRange } from "react-day-picker";
import { formatFixedDouble, formatPercentageDelta, getStatusDelta } from "../../helpers/stats";
import { useAppEarnings } from "../../hooks/general/useAppEarnings";
import { useTotalCO2 } from "../../hooks/general/useTotalCO2";
import { useTotalTransacted } from "../../hooks/general/useTotalTransacted";
import { StatCardSkeleton } from "../skeletons/StatCardSkeleton";
import StatCard from "../StatCard";

export type SectionProps = {
  filter: string
  customRange?: DateRange
}

export default function GeneralSection({filter, customRange}:SectionProps) {
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
    filtered: filteredEarnings,
    previousPeriod: previousPeriodFiltered,
    delta: deltaEarnings, 
    error: errorEarnings, 
    loading: loadingEarnings
  } = useAppEarnings(
    formatLocalDate(fromDate),
    formatLocalDate(toDate),
    formatLocalDate(previousFromDate),
    formatLocalDate(previousToDate),
  )

  const {
    filtered: filteredTransacted,
    previousPeriod: previousPeriodTransacted,
    delta: deltaTransacted, 
    error: errorTransacted, 
    loading: loadingTransacted
  } = useTotalTransacted(
    formatLocalDate(fromDate),
    formatLocalDate(toDate),
    formatLocalDate(previousFromDate),
    formatLocalDate(previousToDate),
  )

  const {
    data: dataCO2, 
    error: errorCO2, 
    loading: loadingCO2
  } = useTotalCO2()

  const globalLoading = loadingTransacted || loadingEarnings || loadingCO2


  if (globalLoading) {
    return(
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCardSkeleton/>
        <StatCardSkeleton/>
        <StatCardSkeleton/>
      </div>
    )
  }

  const earningsStatus =  getStatusDelta(
    deltaEarnings ?? 0, 
    previousPeriodFiltered?.totalFiltered ?? 0
  ) 
  const earningsDeltaPercentage = formatPercentageDelta(
    deltaEarnings ?? 0, 
    previousPeriodFiltered?.totalFiltered ?? 0
  ) 
  
  const transactedStatus = getStatusDelta(
    deltaTransacted ?? 0, 
    previousPeriodTransacted?.totalFiltered ?? 0
  ) 
  const transactedDeltaPercentage = formatPercentageDelta(
    deltaTransacted ?? 0, 
    previousPeriodTransacted?.totalFiltered ?? 0
  ) 
  
  return (
    <div className="space-y-6 "> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Ganancias recaudadas"
          value={`$${formatPrice(filteredEarnings?.totalFiltered ?? 0)} ARS`}
          description={capitalize(formatFilterLabel(filter))}
          icon={ 
            earningsStatus === 'increase' || 
            earningsStatus === 'new' ? (
              <TrendingUp size={18} />
            ) : earningsStatus === 'decrease' ? (
              <TrendingDown size={18} />
            ) : (
              <CircleDashed size={14} />
            )
          }
          trend={
            <span>
              <span className="font-medium">
                {earningsStatus === 'increase' || earningsStatus === 'new' ? '+' :  ''}
                {earningsStatus === 'new' ? 
                  `$${formatPrice(earningsDeltaPercentage)}` : 
                  `${earningsDeltaPercentage}%`}
              </span>
              {' '}
              {!globalLoading && formatFilterLabelPrevious(filter)}
            </span>
          }
          variant={earningsStatus}
        />
        <StatCard
          title="Monto transaccionado"
          value={`$${formatPrice(filteredTransacted?.totalFiltered ?? 0)} ARS`}
          description={capitalize(formatFilterLabel(filter))}
          icon={
            transactedStatus === 'increase' || transactedStatus === 'new' ? (
              <TrendingUp size={18} />
            ) : transactedStatus === 'decrease' ? (
              <TrendingDown size={18} />
            ) : (
              <CircleDashed size={14} />
            )
          }
          trend={
            <span>
              <span className="font-medium">
                {transactedStatus === 'increase' || transactedStatus === 'new' ? '+' :  ''}
                {transactedStatus === 'new' ? 
                  `$${formatPrice(transactedDeltaPercentage)}` : 
                  `${transactedDeltaPercentage}%`}
              </span>
              {' '}
              {formatFilterLabelPrevious(filter)}
            </span>
          }
          variant={transactedStatus}
        />
        <StatCard
          title="Impacto ambiental"
          value={`${formatFixedDouble(dataCO2?.totalC02Saved ?? 0)} kg`}
          description="Total estimado de CO₂ ahorrado"
          icon={<Leaf size={14} />}
          variant={'increase'}
        />


      </div>
    </div>
  )
}