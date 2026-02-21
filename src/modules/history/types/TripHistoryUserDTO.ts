import { VehicleResponseTripDTO } from "@/modules/driver-trips/types/vehicleTrip";

export interface TripHistoryUserDTO {
    tripId:number;
    startDateTime: string;
    driverName:string;
    driverProfileImage: string;
    driverRating: number;
    vehicle: VehicleResponseTripDTO;
    startCity: string;
    destinationCity: string;
    seatPrice: number;
    tripState: string;
    reviewed: boolean;
}