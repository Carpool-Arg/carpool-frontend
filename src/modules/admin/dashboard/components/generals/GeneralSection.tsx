import { CircleDashed, Leaf, TrendingDown, TrendingUp } from "lucide-react";
import StatCard from "../StatCard";
import { useAppEarnings } from "../../hooks/general/useAppEarnings";
import { useCompletedTrips } from "../../hooks/general/useCompletedTrips";
import { useTotalTransacted } from "../../hooks/general/useTotalTransacted";
import { formatPrice } from "@/shared/utils/number";
import { formatFixedDouble, formatPercentageDelta, getStatusDelta } from "../../helpers/stats";
import { useTotalCO2 } from "../../hooks/general/useTotalCO2";


export default function GeneralSection() {
  const fromDate = '01-04-2026'
  const toDate = '26-04-2026'

  const {
    currentMonth: currentMonthEarnings, 
    previousMonth: previousMonthEarnings, 
    delta: deltaEarnings, 
    error: errorEarnings, 
    loading: loadingEarnings
  } = useAppEarnings(fromDate,toDate)

  

  const {
    currentMonth: currentMonthTrips, 
    previousMonth : previousMonthTrips, 
    filtered,
    delta: deltaTrips, 
    error: errorTrips, 
    loading: loadingTrips
  } = useCompletedTrips(fromDate,toDate)

  const {
    currentMonth: currentMonthTransacted, 
    previousMonth : previousMonthTransacted, 
    filtered: filteredTransacted,
    delta: deltaTransacted, 
    error: errorTransacted, 
    loading: loadingTransacted
  } = useTotalTransacted(fromDate,toDate)

  const earningsStatus = getStatusDelta(deltaEarnings ?? 0)
  const earningsDeltaPercentage = formatPercentageDelta(deltaEarnings ?? 0, previousMonthEarnings?.totalFiltered ?? 0)
  
  const transactedStatus = getStatusDelta(deltaTransacted ?? 0)
  const transactedDeltaPercentage = formatPercentageDelta(deltaTransacted ?? 0, previousMonthTransacted?.totalFiltered ?? 0)

  const tripsStatus = getStatusDelta(deltaTrips ?? 0)
  const tripsDeltaPercentage = formatPercentageDelta(deltaTrips ?? 0, previousMonthTrips?.totalFiltered ?? 0)
  
  const {
    data: dataCO2, 
    error: errorCO2, 
    loading: loadingCO2
  } = useTotalCO2()
  

  return (
    <div className="space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Ganancias recaudadas"
          value={`$${formatPrice(currentMonthEarnings?.totalFiltered ?? 0)} ARS`}
          description="Últimos 30 días"
          icon={
            earningsStatus === 'increase' ? (
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
                {earningsStatus === 'increase' ? '+' :  ''}
                {earningsDeltaPercentage}% 
              </span>
              {' '}
              respecto mes anterior
            </span>
            }
          variant={earningsStatus}
        />
        <StatCard
          title="Monto transaccionado"
          value={`$${formatPrice(currentMonthTransacted?.totalFiltered ?? 0)} ARS`}
          description="Últimos 30 días"
          icon={
            transactedStatus === 'increase' ? (
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
                {transactedStatus === 'increase' ? '+' :  ''}
                {transactedDeltaPercentage}% 
              </span>
              {' '}
              respecto mes anterior
            </span>
            }
          variant={transactedStatus}
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