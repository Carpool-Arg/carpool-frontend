import { Stat } from "@/modules/activity/types/Stat"
import { BaseResponse } from "@/shared/types/response"

export interface AdminStatSimpleDTO {
  historicalTotal: number
  totalFiltered: number
  historialByPeriod: Stat[]
}

export type AdminStatsSimpleResponse = BaseResponse<AdminStatSimpleDTO>