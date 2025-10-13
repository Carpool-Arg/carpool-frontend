export interface Trip{
    startDateTime: string;
    idVehicle: number;
    tripstops?: [];
    availableSeat: number;
    availableBaggage?: string;
    seatPrice: number;
}

export interface TripFilters {
    originCityId: number;
    destinationCityId: number;
    userCityId?: number;
    departureDate?: string | null;
    minPrice?: number;
    maxPrice?: number;
    driverRating?: number;
    orderByDriverRating?: boolean;
}

