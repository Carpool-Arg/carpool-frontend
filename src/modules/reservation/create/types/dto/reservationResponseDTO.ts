
import { BaseResponse } from "@/shared/types/response";
import { ReservationDTO } from "../reservation";


export interface ReservationResponseDTO {
    reservation: ReservationDTO[];
    total ?: number;
}

export type ReservationResponse = BaseResponse<ReservationResponseDTO>;