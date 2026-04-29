'use client'

import BarChartCard from "@/modules/activity/components/barchart/BarChartCard"
import BarChartHeader from "@/modules/activity/components/barchart/BarChartHeader"
import { formatChartData, formatFilterLabel, formatFilterLabelPrevious, getDynamicGroupBy, getPreviousRangeForFilter, getRangeForFilter, GroupByType, mapFilterToOrderBy } from "@/modules/activity/helpers/stats"
import { formatLocalDate } from "@/shared/utils/date"
import { formatPrice } from "@/shared/utils/number"
import { capitalize } from "@/shared/utils/string"
import { BadgeCheck, CircleDashed, CircleUserRound, TrendingDown, TrendingUp, User, Users } from "lucide-react"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { formatPercentageDelta, getStatusDelta } from "../../helpers/stats"
import { useDriversPercentage } from "../../hooks/user/useDriversPercentage"
import { useNewUsers } from "../../hooks/user/useNewUsers"
import { useVerifiedUsers } from "../../hooks/user/useVerifiedUsers"
import DashboardSeparator from "../DashboardSeparator"
import { SectionProps } from "../generals/GeneralSection"
import { StatCardSkeleton } from "../skeletons/StatCardSkeleton"
import StatCard from "../StatCard"
import DriversPercentage from "./DriversPercentage"

export default function UserSection({filter, customRange}:SectionProps) {
  const [newUsersFilter, setNewUsersFilter] = useState("month");
  const [newUsersCustomRange, setNewUsersCustomRange] = useState<DateRange>()

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
  
  const { from: newUsersFrom, to: newUsersTo } =
    newUsersFilter === "custom" && newUsersCustomRange?.from && newUsersCustomRange?.to
      ? {
          from: newUsersCustomRange.from,
          to: newUsersCustomRange.to,
        }
      : getRangeForFilter(newUsersFilter)
      
  const newUsersGroupBy =
    filter === "custom"
      ? getDynamicGroupBy(newUsersFrom, newUsersTo)
      : mapFilterToOrderBy(filter)

  const newUsersChartGroupBy =
    newUsersFilter === "custom"
      ? getDynamicGroupBy(newUsersFrom, newUsersTo)
      : mapFilterToOrderBy(newUsersFilter)

  const { 
    filtered: filteredUsers,
    previousPeriod: previousPeriodUsers,
    delta: deltaUsers,
    error: errorUsers,
    loading: loadingUsers
  } = useNewUsers(
    formatLocalDate(fromDate),
    formatLocalDate(toDate),
    newUsersGroupBy,
    formatLocalDate(previousFromDate),
    formatLocalDate(previousToDate),
  )

  const { 
    filtered: filteredChartUsers,
    error: errorChartUsers,
    loading: loadingChartUsers
  } = useNewUsers(
    formatLocalDate(newUsersFrom),
    formatLocalDate(newUsersTo),
    newUsersChartGroupBy
  )

  const formattedNewUsers = formatChartData(
    filteredChartUsers?.historialByPeriod,
    newUsersChartGroupBy as GroupByType
  )

  console.log('filteredChartUsers', filteredChartUsers)
  console.log('formattedNewUsers', formattedNewUsers)

  const { data, loading: loadingDrivers, error } = useDriversPercentage()
  
  
  const {
    data: dataVerified, 
    loading: loadingVerified, 
    error: errorVerified
  } = useVerifiedUsers()

  const globalLoading = loadingUsers || loadingVerified || loadingDrivers

  const newUsersStatus = getStatusDelta(
    deltaUsers ?? 0, 
    previousPeriodUsers?.totalFiltered ?? 0
  )
  const newUsersPercentage = formatPercentageDelta(
    deltaUsers ?? 0, 
    previousPeriodUsers?.totalFiltered ?? 0
  )

  

  return (
    <div className="space-y-4">
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
              title="Nuevos usuarios"
              value={`+${filteredUsers?.totalFiltered ?? 0}`}
              description={capitalize(formatFilterLabel(filter))}
              icon={
                newUsersStatus === 'increase' || newUsersStatus === 'new' ? (
                  <TrendingUp size={18} />
                ) : newUsersStatus === 'decrease' ? (
                  <TrendingDown size={18} />
                ) : (
                  <CircleDashed size={14} />
                )
              }
              trend={
                <span>
                  <span className="font-medium">
                    {newUsersStatus === 'increase' || newUsersStatus === 'new' ? '+' :  ''}
                    {newUsersStatus === 'new' ? 
                      `${formatPrice(newUsersPercentage)}` : 
                      `${newUsersPercentage}%`}
                  </span>
                  {' '}
                  {formatFilterLabelPrevious(filter)}
                </span>
              }
              variant={newUsersStatus}
            />
            <StatCard
              title="Usuarios verificados"
              value={`${dataVerified?.totalVerified ?? 0}`}
              description="Total de usuarios verificados"
              icon={<BadgeCheck size={18}/>}
              variant={"increase"}
            />
            <StatCard
              title="Conductores"
              value={`${data?.totalDrivers}`}
              description="Total de conductores"
              icon={<CircleUserRound size={18}/>}
              variant={"default"}
            />
          </>
        }
        
      </div>
      <DashboardSeparator 
        title="Análisis de usuarios"
        desc="Evolución de registros y distribución de usuarios"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <BarChartCard
          title="Usuarios registrados"
          desc={
            <>
              Se registraron {" "}
              <span className="font-semibold">
                {filteredUsers?.historicalTotal ?? 0}
              </span>{" "}
              usuarios en total
            </>
          }
          icon={User}
          data={formattedNewUsers ?? []}
          totalFiltered={filteredUsers?.totalFiltered ?? 0}
          loading={loadingChartUsers}
          error={errorChartUsers}
          filter={newUsersFilter}
          onFilterChange={setNewUsersFilter}
          customRange={newUsersCustomRange}
          onCustomRangeChange={setNewUsersCustomRange}
          unit="usuarios"
        />
        <div className="bg-gray-8 border border-gray-2/50 rounded-2xl h-full flex flex-col">
          {/* Header */}
          <BarChartHeader
            title="Distribución de usuarios"
            desc="Conductores vs pasajeros"
            icon={Users}
          />

          {/* Body */}
          <div className="px-5 py-6 flex-1 flex flex-col items-center ">
            <DriversPercentage
              data={data ?? null}
              loading={loadingDrivers}
              error={error}
            />
          </div>          
        </div>
        
      </div>
    </div>
  )
}