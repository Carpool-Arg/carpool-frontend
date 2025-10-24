// components/trip-details/BookingModal.tsx
"use client";

import { TripDetailsData } from "@/types/response/trip";
import { useState, useEffect } from "react";
// Asegúrate de que tienes estos componentes y tipos disponibles
// import { Button } from "../ui/ux/Button"; 

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripDetailsData;
  initialOriginId?: number;
  initialDestinationId?: number;
}

export default function BookingModal({ 
    isOpen, 
    onClose, 
    trip, 
    initialOriginId, 
    initialDestinationId 
}: BookingModalProps) {

  // --- 1. Estado del Formulario ---
  const [selectedOriginId, setSelectedOriginId] = useState<number | undefined>(undefined);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | undefined>(undefined);
  const [hasLuggage, setHasLuggage] = useState(false);
  const [seats, setSeats] = useState(1);

  // --- 2. Lógica de Precarga (useEffect) ---
  useEffect(() => {
    if (isOpen) {
      // Intentar encontrar las paradas que coinciden con los IDs de la búsqueda
      const preselectOrigin = trip.tripStops.find(stop => stop.order === initialOriginId);
      const preselectDestination = trip.tripStops.find(stop => stop.order === initialDestinationId);

      // Si encontramos una coincidencia, preseleccionamos el ID
      if (preselectOrigin) {
        setSelectedOriginId(preselectOrigin.order);
      } else {
        // Opcional: Si no hay match, podemos usar la parada inicial del viaje
        setSelectedOriginId(trip.tripStops.find(stop => stop.start)?.order);
      }

      if (preselectDestination) {
        setSelectedDestinationId(preselectDestination.order);
      } else {
        // Opcional: Si no hay match, podemos usar la parada final del viaje
        setSelectedDestinationId(trip.tripStops.find(stop => stop.destination)?.order);
      }
    }
  }, [isOpen, initialOriginId, initialDestinationId, trip.tripStops]);


  if (!isOpen) return null;

  // ... (Lógica de cálculo del costo y manejo de envío) ...
  const totalCost = trip.seatPrice * seats;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la llamada fetch a tu API Route /api/reservations/create
    console.log({
        tripId: trip.id,
        originStopId: selectedOriginId,
        destinationStopId: selectedDestinationId,
        seats,
        hasLuggage,
    });
    alert('Reserva simulada. Revisa la consola para el payload.');
    onClose();
  };


  return (
    // ... (Estructura del Modal, usando los estados definidos)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-4">Confirmar Reserva</h3>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          
          {/* Origen de Reserva */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Punto de Subida (Origen)</label>
            <select 
              value={selectedOriginId || ''} // Usar || '' para manejar el undefined
              onChange={(e) => setSelectedOriginId(Number(e.target.value))} 
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona tu Origen</option>
              {trip.tripStops.map(stop => (
                <option key={stop.order} value={stop.order}>
                  {stop.cityName} ({stop.estimatedArrivalDateTime})
                </option>
              ))}
            </select>
          </div>

          {/* ... (Destino de Reserva, Equipaje y Botones) ... */}

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border rounded">
              Cancelar
            </button>
            <button 
                type="submit" 
                className="px-4 py-2 bg-primary text-white rounded font-semibold disabled:opacity-50"
                disabled={!selectedOriginId || !selectedDestinationId || seats === 0}
            >
                Reservar por ${totalCost}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}