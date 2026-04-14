import { TripResponseDTO } from "@/modules/trip/types/dto/tripResponseDTO";
import { getTripDetails, verifyIfUserIsCreator } from "@/services/trip/tripService";
import { useCallback, useEffect, useState } from "react";


type UseTripDetailsResult = {
  trip: TripResponseDTO["data"];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useTripDetails(tripId?: number): UseTripDetailsResult {
  const [trip, setTrip] = useState<TripResponseDTO["data"]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchTrip = useCallback(async () => {
    if (!tripId) return;

    setLoading(true);
    setError(null);

    try {
      const creatorRes = await verifyIfUserIsCreator(Number(tripId));
      if(creatorRes.data){
        setError("No puedes ver los detalles de este viaje.");
        return;
      }
      const response = await getTripDetails(tripId);

      if (response.state === "ERROR") {
        throw new Error(response.messages?.[0]);
      }

      setTrip(response.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
      setTrip(null);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  return {
    trip,
    loading,
    error,
    refetch: fetchTrip,
  };
}
