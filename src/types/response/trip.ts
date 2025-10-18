import { DriverSearchResponseDTO } from "../driverSearchResponseDTO";
import { TripStop } from "../tripStop";
import { VehicleResponseTripDTO } from "../vehicleResponseTripDTO";
import { BaseResponse } from "./response";

export interface TripDetailsData{
    id: number;
    startDateTime: string;
    currentAvailableSeats:number;
    driverInfo: DriverSearchResponseDTO;
    vehicle: VehicleResponseTripDTO;
    tripStops: TripStop[]
    availableSeat: number;
    availableBaggage: string;
    seatPrice: number;
}

export type TripResponse = BaseResponse<TripDetailsData>