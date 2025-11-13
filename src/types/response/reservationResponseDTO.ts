import { ReservationDTO } from "../reservationDTO";
import { BaseResponse } from "./response";

export interface ReservationResponseDTO {
    reservation: ReservationDTO[];
}

export type ReservationResponse= BaseResponse<ReservationResponseDTO>;