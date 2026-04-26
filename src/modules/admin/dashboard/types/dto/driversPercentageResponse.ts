import { BaseResponse } from "@/shared/types/response";


export interface DriversPercentageResponseDTO {
  driverPercentage:number;
}

export type DriversPercentageResponse = BaseResponse<DriversPercentageResponseDTO>