import { BaseResponse } from "@/shared/types/response";
import { Passenger } from "../passenger";


export interface Passengers{
  passengers: Passenger[]
}
export type TripPassengersResponseDTO = BaseResponse<Passengers>