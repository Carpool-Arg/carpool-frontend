import { TripDriverDTO } from "../tripDriverDTO";
import { BaseResponse } from "./response";

export interface TripDriverResponseDTO {
    trips: TripDriverDTO[];
}

export type TripDriverResponse = BaseResponse<TripDriverResponseDTO>;