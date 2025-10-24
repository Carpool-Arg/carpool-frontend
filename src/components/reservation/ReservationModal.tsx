// components/trip-details/BookingModal.tsx
"use client";

import { TripDetailsData } from "@/types/response/trip";
import { useState, useEffect } from "react";
import { capitalizeWords } from "@/utils/string";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { newReservation } from "@/services/reservationService";

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
  initialDestinationId,
}: BookingModalProps) {
  // --- 1. Estado del Formulario ---
  const [selectedOriginId, setSelectedOriginId] = useState<number | undefined>(
    undefined
  );
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    number | undefined
  >(undefined);
  const [hasBaggage, setHasBaggage] = useState(false);
  const [seats, setSeats] = useState(1);

  // --- 2. Lógica de Precarga ---
  useEffect(() => {
    if (isOpen && trip.tripStops?.length > 0) {
      const preselectOrigin = trip.tripStops.find(
        (stop) => stop.cityId === initialOriginId
      );
      const preselectDestination = trip.tripStops.find(
        (stop) => stop.cityId === initialDestinationId
      );

      if (preselectOrigin) {
        setSelectedOriginId(preselectOrigin.tripStopId);
      } else {
        setSelectedOriginId(
          trip.tripStops.find((stop) => stop.start)?.tripStopId
        );
      }

      if (preselectDestination) {
        setSelectedDestinationId(preselectDestination.tripStopId);
      } else {
        setSelectedDestinationId(
          trip.tripStops.find((stop) => stop.destination)?.tripStopId
        );
      }
    }
  }, [isOpen, trip.tripStops, initialOriginId, initialDestinationId]);

  if (!isOpen) return null;

  const totalCost = trip.seatPrice * seats;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        trip: trip.id,
        startCity: selectedOriginId!,
        destinationCity: selectedDestinationId!,
        baggage: hasBaggage,
      };
      const result = await newReservation(payload); 
      console.log("Reserva creada:", result);

      onClose(); // cerrar modal
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("Ocurrió un error al crear la reserva. Revisa la consola.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-dark-5 p-6 rounded-lg w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Confirmar Reserva</h3>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 w-full">
            {/* 1. Origen de Reserva */}
            <div className="mb-4 w-1/2">
              <label className="block text-sm font-medium mb-1">
                Punto de Subida (Origen)
              </label>

              {trip.tripStops?.length > 0 && (
                <Select
                  key={`origin-${selectedOriginId ?? "none"}`}
                  value={selectedOriginId ? String(selectedOriginId) : ""}
                  onValueChange={(value) => setSelectedOriginId(Number(value))}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tu Origen" />
                  </SelectTrigger>
                  <SelectContent>
                    {trip.tripStops.map((stop) => (
                      <SelectItem
                        key={stop.tripStopId}
                        value={String(stop.cityId)}
                      >
                        {capitalizeWords(stop.cityName)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* 2. Destino de Reserva */}
            <div className="mb-4 w-1/2">
              <label className="block text-sm font-medium mb-1">
                Punto de Bajada (Destino)
              </label>

              {trip.tripStops?.length > 0 && (
                <Select
                  key={`destination-${selectedDestinationId ?? "none"}`}
                  value={selectedDestinationId ? String(selectedDestinationId) : ""}
                  onValueChange={(value) => setSelectedDestinationId(Number(value))}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tu Destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {trip.tripStops
                      .filter((stop) => {
                        if (!selectedOriginId) return true;

                        const originIndex = trip.tripStops.findIndex(
                          (s) => s.tripStopId === selectedOriginId
                        );
                        const destinationIndex = trip.tripStops.findIndex(
                          (s) => s.tripStopId === stop.tripStopId
                        );

                        return destinationIndex > originIndex;
                      })
                      .map((stop) => (
                        <SelectItem
                          key={stop.tripStopId}
                          value={String(stop.cityId)}
                          disabled={stop.tripStopId === selectedOriginId}
                        >
                          {capitalizeWords(stop.cityName)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
 
          <div className="flex items-center space-x-2">
            <Label htmlFor="luggage-switch" className="text-sm font-medium">
              ¿Llevas equipaje?
            </Label>
            <Switch 
              id="luggage-switch" 
              checked={hasBaggage} 
              onCheckedChange={setHasBaggage} 
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded"
            >
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
