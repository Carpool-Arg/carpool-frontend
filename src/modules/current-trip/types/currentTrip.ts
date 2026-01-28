import { CurrentTripStopDTO } from "./currentTripStop";

export interface CurrentTripDTO{
  idTrip: string;
  tripStops: CurrentTripStopDTO[];
  totalDistance: number;
}