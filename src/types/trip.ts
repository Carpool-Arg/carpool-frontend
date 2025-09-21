export interface Trip{
    startDateTime: string;
    idVehicle: number;
    tripstops?: [];
    availableSeat: number;
    availableBaggage?: string;
    seatPrice: number;
}