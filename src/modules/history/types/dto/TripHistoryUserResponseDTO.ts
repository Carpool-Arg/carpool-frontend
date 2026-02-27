import { BaseResponse } from "@/shared/types/response";
import { TripHistoryUserDTO } from "../TripHistoryUserDTO";

export interface TripHistoryUserResponseDTO {
    trips: TripHistoryUserDTO[];
}

export type TripHistoryUserResponse = BaseResponse<TripHistoryUserResponseDTO>;