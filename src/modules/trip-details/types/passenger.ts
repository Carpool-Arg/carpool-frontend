import { PassengerReview } from "./passengerReview";


export interface Passenger {
  idPassenger: number;
  passengerName: string;
  passengerLastname: string;
  profilePhotoUrl: string;
  review: PassengerReview
}