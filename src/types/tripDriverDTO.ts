import { VehicleResponseTripDTO } from "./vehicleResponseTripDTO";

export interface TripDriverDTO {
    id:number;
    vehicle: VehicleResponseTripDTO;
    startrDateTime: string;
    availableSeats: number;
    currentAvailableSeats: number;
    availableBaggage: number;
    seatPrice: number;
}