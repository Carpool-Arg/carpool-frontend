export interface ReeservationRequestDTO {
    idTrip: number;
    idStartCity: number | null;
    idDestinationCity: number | null;
    baggage: boolean | null;
    nameState: string | null;
}