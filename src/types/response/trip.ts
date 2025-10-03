import { TripStop } from "../tripStop";
import { VehicleResponseTripDTO } from "../vehicleResponseTripDTO";
import { BaseResponse } from "./response";

export interface TripDetailsData{
    id: number;
    driverName: string;
    driverRating: number;
    startDateTime: string;
    currentAvailableSeats:number;
    vehicle: VehicleResponseTripDTO;
    tripStops: TripStop[]
    availableSeat: number;
    availableBaggage: string;
    seatPrice: number;
}

export type TripResponse = BaseResponse<TripDetailsData>