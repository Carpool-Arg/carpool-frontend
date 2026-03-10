import { TripStop } from "@/models/tripStop";

export interface CurrentTripStopDTO{
  tripStop: TripStop;
  arrivalDateTime: string;
  distanceFromPrevious: number;
  tripstopId: string;
}