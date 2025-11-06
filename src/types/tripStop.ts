export interface TripStop{
    cityName?: string
    cityId: number;
    order: number;
    start: boolean;
    destination: boolean;
    observation: string;
    estimatedArrivalDateTime?: string;
}

export type TripStopExtended = TripStop & {
  cityName: string;
};