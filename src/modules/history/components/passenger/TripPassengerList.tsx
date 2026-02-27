import { useState } from "react";
import { TripHistoryUserDTO } from "../../types/TripHistoryUserDTO";
import { TripPassengerCard } from "./TripPassengerCard";

interface TripPassengerListProps {
  trips: TripHistoryUserDTO[];
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function TripPassengerList({ trips, onError, onSuccess }: TripPassengerListProps) {
  const [openMenuTripId, setOpenMenuTripId] = useState<number | null>(null);

  if (trips.length === 0) {
    return (
      <div className="text-center text-sm text-gray-600 py-10">
        Todavía no tenés viajes asociados.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {trips.map((trip) => (
        <TripPassengerCard key={trip.tripId} trip={trip} onError={onError}  onSuccess={onSuccess}  openMenuTripId={openMenuTripId} setOpenMenuTripId={setOpenMenuTripId} />
      ))}
    </div>
  );
}