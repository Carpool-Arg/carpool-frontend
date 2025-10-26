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

export type VerifyCreatorResponse = BaseResponse<{ isCreator: boolean }>
  
export interface SearchData {
    driverInfo: {
        fullName: string
        profileImageUrl: string
        rating: number
    }
    startDateTime: string // ISO string
    tripStops: {
        cityName: string
        observation: string
        estimatedArrivalDateTime: string
        destination: boolean
        start: boolean
    }[]
    availableSeat: number
    seatPrice: number
    tripId:number
}

export type SearchResponse = BaseResponse<SearchData[]>