import { BaseResponse } from "@/shared/types/response";
import { DriverPendingDTO } from "../driverPending";

interface DriverPendingResponseDTO{
  total:number
  drivers: DriverPendingDTO[]

}


export type DriverPendingResponse = BaseResponse<DriverPendingResponseDTO>