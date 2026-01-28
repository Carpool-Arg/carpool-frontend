"use client";


import { Circle, Square, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ux/Button";
import Separator from "@/components/ux/Separator";
import { TripStop } from "@/models/tripStop";
import { TripDetailsData } from "@/modules/trip/types/tripDetails";
import { Reservation } from "@/models/reservation";
import { capitalize, capitalizeWords } from "@/shared/utils/string";
import { formatPrice } from "@/shared/utils/number";
import { calculateTotal } from "@/services/reservation/reservationService";
import { Toast } from "@/components/ux/Toast";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripDetailsData;
  initialOriginId?: number;
  initialDestinationId?: number;
  onSubmit: (payload: Reservation) => Promise<void>;
}

export default function ReservationModal({
  isOpen,
  onClose,
  trip,
  initialOriginId,
  initialDestinationId,
  onSubmit
}: ReservationModalProps) {
  const [selectedOrigin, setSelectedOrigin] = useState<TripStop | undefined>(undefined);
  const [selectedDestination, setSelectedDestination] = useState<TripStop | undefined>(undefined);
  const [hasBaggage, setHasBaggage] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'warning' } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false);



  // Flag para saber si el viaje es entre paradas intermedias
  const isIntermediate = selectedOrigin?.start === false || selectedDestination?.destination === false;

  // Precarga de ciudades buscadas
  useEffect(() => {
    if (isOpen && trip.tripStops?.length > 0) {
      const preselectOrigin = trip.tripStops.find(
        (stop) => stop.cityId === initialOriginId
      );
      const preselectDestination = trip.tripStops.find(
        (stop) => stop.cityId === initialDestinationId
      );

      if (preselectOrigin) {
        setSelectedOrigin(preselectOrigin);
      } else {
        setSelectedOrigin(
          trip.tripStops.find((stop) => stop.start)
        );
      }

      if (preselectDestination) {
        setSelectedDestination(preselectDestination);
      } else {
        setSelectedDestination(
          trip.tripStops.find((stop) => stop.destination)
        );
      }
    }
  }, [isOpen, trip.tripStops, initialOriginId, initialDestinationId]);

  useEffect(() => {
    if (
      !isOpen ||
      !selectedOrigin?.cityId ||
      !selectedDestination?.cityId
    ) {
      setTotalPrice(null);
      return;
    }

    const fetchPrice = async () => {
      try {
        setLoadingPrice(true);
        setTotalPrice(null);

        const res = await calculateTotal(
          trip.id,
          selectedOrigin.cityId,
          selectedDestination.cityId,
        );

        setTotalPrice(res.data);
      } catch (error) {
        setToast({ message: "Error calculando precio", type: 'error' });
        console.error("Error calculando precio", error);
        setTotalPrice(null);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [
    isOpen,
    selectedOrigin?.cityId,
    selectedDestination?.cityId,
    trip.id,
  ]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const payload = {
      trip: trip.id,
      startCity: selectedOrigin?.cityId ?? 0,
      destinationCity: selectedDestination?.cityId ?? 0,
      baggage: hasBaggage,
    };
    try{
      onSubmit(payload);
    }catch{
      setIsProcessing(false)
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-dark-5 p-6 rounded-lg w-md md:w-lg border border-gray-8">
        <h3 className="text-xl font-semibold">Confirmar Reserva</h3>
        <Separator color="bg-gray-2" marginY="my-4"/>
        <form onSubmit={handleSubmit}>
          
          <div className="flex items-center gap-2 w-full mb-4">
            <div className="flex flex-col items-center">
              <Circle size={10} fill="currentColor" stroke="currentColor" />
              <div className="w-0.5 h-16 bg-gray-9 my-1"></div>
              <Square size={10} fill="currentColor" stroke="currentColor" />
            </div>
            <div className="flex flex-col gap-3 w-full">
              
              {/* 1. Origen de Reserva */}
              <div className="mb-4 w-1/2">
                <label className="block text-sm font-medium mb-1 font-inter">
                  Origen
                </label>

                {trip.tripStops?.length > 0 && (
                  <Select
                    key={`origin-${selectedOrigin?.cityId ?? "none"}`}
                    value={selectedOrigin ? String(selectedOrigin.cityId) : ""}
                    onValueChange={(value) => {
                      const selected = trip.tripStops.find(
                        (stop) => stop.cityId === Number(value)
                      );
                      setSelectedOrigin(selected || undefined);
                      if (selected && selectedDestination && selectedDestination.order <= selected.order) {
                        setSelectedDestination(undefined);
                      }
                    }}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu Origen" />
                    </SelectTrigger>
                    <SelectContent>
                      {trip.tripStops
                      .filter((stop) => !stop.destination)
                      .map((stop) => (
                        <SelectItem key={stop.order} value={String(stop.cityId)}>
                          {capitalizeWords(stop.cityName)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                )}
              </div>

              {/* 2. Destino de Reserva */}
              <div className="mb-4 w-1/2">
                <label className="block text-sm font-medium mb-1 font-inter">
                  Destino
                </label>
                {trip.tripStops?.length > 0 && (
                  <Select
                    key={`destination-${selectedDestination?.cityId ?? "none"}`}
                    value={selectedDestination ? String(selectedDestination.cityId) : undefined}
                    onValueChange={(value) => {
                      const selected = trip.tripStops.find(
                        (stop) => stop.cityId === Number(value)
                      );
                      setSelectedDestination(selected || undefined);
                      
                    }}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu Destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {trip.tripStops
                        .filter((stop) => {
                          if (!selectedOrigin?.order) return true;

                          const originIndex = trip.tripStops.findIndex(
                            (s) => s.order === selectedOrigin.order
                          );
                          const destinationIndex = trip.tripStops.findIndex(
                            (s) => s.order === stop.order
                          );

                          return destinationIndex > originIndex;
                        })
                        .map((stop) => (
                          <SelectItem
                            key={stop.order}
                            value={String(stop.cityId)}
                            disabled={stop.cityId === selectedOrigin?.cityId}
                          >
                            {capitalizeWords(stop.cityName)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                )}
              </div>
            </div>
          </div>

          {/* 3. Equipaje */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <Label htmlFor="luggage-switch" className="font-medium ">
                ¿Llevas equipaje?
              </Label>
              <Switch 
                id="luggage-switch" 
                checked={hasBaggage} 
                onCheckedChange={setHasBaggage} 
                disabled={trip.availableBaggage === 'NO_EQUIPAJE'}
              />
              
            </div>
            {hasBaggage && (
              <div className="flex items-center gap-1 bg-gray-8 p-2 rounded-lg">
                <TriangleAlert size={14}/>
                <p className="text-sm font-inter">Recuerda que el límite de equipaje para este viaje es 
                  <span className="font-medium"> {capitalize(trip.availableBaggage)}</span>
                  .
                  </p>
              </div>
            )}
            {trip.availableBaggage === 'NO_EQUIPAJE' && (
              <div className="flex items-center gap-1 bg-gray-8 p-2 rounded-lg">
                <TriangleAlert size={14}/>
                <p className="text-sm font-inter">En este viaje no se permite equipaje.</p>
              </div>
            )}
          </div>


          {/* 4. Precio de la reserva */}
          <div className="flex items-end justify-between gap-2">
            <h2 className="font-medium whitespace-nowrap font-outfit">
              Precio <span className="text-sm">(por pasajero)</span>
            </h2>
            
            
          {loadingPrice ? (
            <div className="h-8 w-28 rounded bg-gray-8 animate-pulse" />
          ) : totalPrice !== null ? (
            <p className="text-2xl font-outfit font-semibold">
              ${formatPrice(totalPrice)}
            </p>
          ) : (
            <p className="text-2xl font-outfit font-semibold text-gray-4">
              $ <span className="text-xl">—</span>
            </p>
          )}

            
          </div>
          <Separator color="bg-gray-2" marginY="my-1"/>
          


          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded"
              disabled={isProcessing}
            >
              Cancelar
            </Button>

            <Button
                type="submit"
                variant="primary"
                className="disabled:opacity-50"
                disabled={selectedDestination?.cityId === undefined || isProcessing}
              >
              {isProcessing ? (
                <div className="px-6 py-0.5">
                  <div className=" h-4 w-4 animate-spin rounded-full border-2 border-gray-2 border-t-transparent"></div>
                </div>
              ) : (
                "Reservar"
              )}
            </Button>
            
          </div>
        </form>
      </div>

      {toast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] sm:max-w-md pointer-events-none flex justify-center">
              <div className="pointer-events-auto w-full">
                  <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                  />
              </div>
          </div>
      )}
    </div>
  );
}
