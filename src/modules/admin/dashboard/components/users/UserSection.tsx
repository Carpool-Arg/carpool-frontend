'use client'

import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, CircleDashed, CircleUserRound, TrendingDown, TrendingUp, Users } from "lucide-react"
import { useDriversPercentage } from "../../hooks/user/useDriversPercentage"
import DriversPercentage from "./DriversPercentage"
import StatCard from "../StatCard"
import { useNewUsers } from "../../hooks/user/useNewUsers"
import { formatPercentageDelta, getStatusDelta } from "../../helpers/stats"
import { useVerifiedUsers } from "../../hooks/user/useVerifiedUsers"



export default function UserSection() {
  const fromDate = '01-04-2026'
  const toDate = '26-04-2026'

  const { data, loading, error } = useDriversPercentage()

  const { 
    currentMonth: currentMonthUsers,
    previousMonth: previousMonthUsers,
    filtered: filteredUsers,
    delta: deltaUsers,
    error: errorUsers,
    loading: loadingUsers
  } = useNewUsers(fromDate,toDate,'MONTH')

  const {
    data: dataVerified, 
    loading: loadingVerified, 
    error: errorVerified
  } = useVerifiedUsers()

  
  const newUsersStatus = getStatusDelta(deltaUsers ?? 0)
  const newUsersPercentage = formatPercentageDelta(
    deltaUsers ?? 0, 
    previousMonthUsers?.totalFiltered ?? 0
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Nuevos usuarios"
          value={`+${currentMonthUsers?.totalFiltered ?? 0}`}
          description="Últimos 30 días"
          icon={
            newUsersStatus === 'increase' ? (
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
                {newUsersStatus === 'increase' ? '+' :  ''}
                {newUsersPercentage}% 
              </span>
              {' '}
              respecto mes anterior
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
          value={`${123}`}
          description="Total de conductores"
          icon={<CircleUserRound size={18}/>}
          variant={"default"}
        />
      </div>
      <div className="grid gap-4">
        <Card className="bg-gray-8 border-gray-2/50 rounded-2xl w-1/2">
          <CardContent className="p-0">

            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-9/20">
              <div className="p-2.5 bg-gray-10/60 border border-gray-9/20 rounded-xl">
                <Users size={18} className="text-gray-11" />
              </div>
              <div>
                <h2 className="font-semibold text-base leading-tight">
                  Distribución de usuarios
                </h2>
                <p className="text-xs text-gray-11 mt-0.5">
                  Conductores vs pasajeros
                </p>
              </div>
            </div>

            {/* Filtros */}
            

            {/* Body */}
            <div className="px-5 py-6">
              <DriversPercentage
                driverPercentage={data?.driverPercentage ?? 0}
                loading={loading}
                error={error}
              />
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}