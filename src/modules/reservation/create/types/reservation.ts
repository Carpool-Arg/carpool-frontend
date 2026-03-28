export interface ReservationDTO{
    id:number;
    createdAt:string;
    tripStartDatetime: string;
    startCity: string;
    destinationCity: string;
    baggage: boolean;
    nameUser: string;
    lastNameUser: string;
    urlImage: string;
    state: string;
    ratingUser: number;
}