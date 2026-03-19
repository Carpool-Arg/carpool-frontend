import { useState } from "react";
import { TripHistoryUserDTO } from "../../types/TripHistoryUserDTO";
import { TripPassengerCard } from "./TripPassengerCard";
import { MapPinOff } from "lucide-react";
import { EmptyAlert } from "@/components/ux/EmptyAlert";

interface TripPassengerListProps {
  trips: TripHistoryUserDTO[];
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function TripPassengerList({ trips, onError, onSuccess }: TripPassengerListProps) {
  const [openMenuTripId, setOpenMenuTripId] = useState<number | null>(null);

  if (trips.length === 0) {
    return (
        <EmptyAlert
          icon={<MapPinOff size={32} />}
          title="No hay viajes disponibles"
          description="Todavía no tenés viajes asociados como pasajero."
        />
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