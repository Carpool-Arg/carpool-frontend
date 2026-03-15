import { getTripPassengers } from "@/services/trip/tripService";
import { useCallback, useEffect, useState } from "react";
import { Passenger } from "../types/passenger";


type UseTripPassengerResult = {
  passengers: Passenger[] | null;
  loading: boolean;
  error: string | null;
};

export function useTripPassengers(tripId: number): UseTripPassengerResult {
  const [passengers, setPassenger] = useState<Passenger[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(tripId)
  
  const fetchTrip = useCallback(async () => {
    if (!tripId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getTripPassengers(tripId);

      if (response.state === "ERROR") {
        throw new Error(response.messages?.[0]);
      }

      setPassenger(response.data?.passengers ?? []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
      setPassenger(null);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return {
    passengers,
    loading,
    error,
  };
}
