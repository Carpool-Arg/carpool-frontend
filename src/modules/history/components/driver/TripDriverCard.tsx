interface TripCardProps {
  trip: {
    id: number;
    startCity: string;
    destinationCity: string;
    startDateTime: string;
    currentAvailableSeats: number;
    seatPrice: number;
    vehicle: {
      vehicleTypeName: string;
      brand: string;
      model: string;
    };
  };
}

export function TripDriverCard({ trip }: TripCardProps) {
  const startDate = new Date(trip.startDateTime);

  return (
    <div  className="trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-20">
      {/* Ruta */}
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm">
          {trip.startCity} → {trip.destinationCity}
        </div>
        <span className="text-sm font-semibold">
          ${trip.seatPrice}
        </span>
      </div>

      {/* Fecha */}
      <div className="text-xs text-gray-6 mb-2">
        {startDate.toLocaleDateString()} ·{" "}
        {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>

      {/* Info secundaria */}
      <div className="flex items-center justify-between text-xs text-gray-6">
        <span>
          {trip.vehicle.vehicleTypeName}
        </span>
        <span>
          {trip.currentAvailableSeats} asientos
        </span>
      </div>
    </div>
  );
}
