'use client'

import { TripDetailsData } from "@/types/response/trip";
import { useEffect, useState } from "react";
import { getTripDetails } from "@/services/tripService";
import { baggageOptions } from "../trip/TripFrom";
import { TripRoutePreview } from "../trip/TripRoutePreview";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";
import { capitalizeWords } from "@/utils/string";
import { TripDetailSkeleton } from "./TripDetailSkeleton";
import { ErrorMessage } from "../ui/Error";
import { formatPrice } from "@/utils/number";
import { useParams, useRouter } from "next/navigation";
import ReservationModal from "../reservation/ReservationModal";
import { Reservation } from "@/types/reservation";
import { newReservation } from "@/services/reservationService";
import { AlertDialog } from "../ux/AlertDialog";
import { Button } from "../ux/Button";

const SEARCH_CONTEXT_KEY = 'carpool_search_context';

export default function TripDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [searchContext, setSearchContext] = useState<{ originId?: number; destinationId?: number } | null>(null);
  const [trip, setTrip] = useState<TripDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  const [alertData, setAlertData] = useState<{
    type: "success" | "error" | null;
    title?: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        if(!id) return
        const res = await getTripDetails(Number(id));
        if (res.state === "ERROR") {
          setError(res.messages[0]);
        }
        setTrip(res.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocurrió un error inesperado.");
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // Cargar el contexto de búsqueda del cliente
    const loadSearchContext = () => {
      const storedContext = sessionStorage.getItem(SEARCH_CONTEXT_KEY);
      if (storedContext) {
        setSearchContext(JSON.parse(storedContext));
      }
    };

    if (id) {
      loadTrip();
      loadSearchContext(); 
    }
  }, [id]);

  const handleReservationSubmit = async (payload: Reservation) => {
    try {
      const result = await newReservation(payload);
      if (result?.state === "OK") {
        // éxito
        setAlertData({
          type: "success",
          title: "¡Reserva creada con éxito!",
          description: "El conductor recibirá tu solicitud en breve.",
        });
        setIsModalOpen(false);
      } else {
        // error de backend
        setAlertData({
          type: "error",
          title: "Error al crear la reserva",
          description: result?.messages?.[0] ?? "Ocurrió un error inesperado.",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("Ocurrió un error al crear la reserva. Revisa la consola.");
    }
  };


  const selectedBaggage = baggageOptions.find(
    (b) => b.value === trip?.availableBaggage
  );

  const BaggageIcon = selectedBaggage?.icon;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) return TripDetailSkeleton();
  if (error) return <ErrorMessage message={error} />;

  if (trip) {
    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto">

        {/* Contenedor en grid */}
        <div
          className="w-full h-full grid grid-cols-9 auto-rows-auto gap-2 md:mt-4"
        >
          {/* Disponibilidad */}
          <div className="col-span-5 row-span-2 bg-gray-6 dark:bg-gray-8 flex flex-col justify-center text-center rounded-xl p-3">
            <h2 className="text-gray-7 dark:text-gray-1 font-medium text-xl">
              Disponibilidad
            </h2>
            <span className="font-medium text-[28px]">
            {trip.currentAvailableSeats}/{trip.availableSeat}
            </span>
          </div>

          {/* Precio */}
          <div className="col-span-4 col-start-6 row-span-2 bg-gray-6 dark:bg-gray-8 flex flex-col justify-center text-center rounded-xl p-3">
            <h2 className="text-gray-7 dark:text-gray-1 font-medium text-xl">
              Precio
            </h2>
            <span className="font-medium text-[28px]">${formatPrice(trip.seatPrice)}</span>
          </div>

          {/* Recorrido */}
          <div className="col-span-9 row-span-4 row-start-3 bg-gray-6 dark:bg-gray-8 rounded-xl flex flex-col">
            <h2 className="text-gray-7 mt-3 ml-3 dark:text-gray-1 font-medium text-xl">
              Recorrido
            </h2>
            <div className="ml-3 mt-2 items-center">
              <TripRoutePreview
                tripStops={trip.tripStops.sort((a, b) => a.order - b.order)}
                withTimes = {true}
              />
            </div>
          </div>

          {/* Datos del conductor */}
          <div className="col-span-9 row-span-2 row-start-7 bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl p-3">
            <h2 className="text-gray-7 dark:text-gray-1 font-medium text-xl mb-2">
              Datos del conductor
            </h2>
            <div className="flex gap-5 items-center">
              <Image
                src={trip.driverInfo.profileImageUrl || "/default-profile.png"}
                alt="Foto de perfil"
                width={60} // o el tamaño real que querés renderizar
                height={60}
                className="w-15 h-15 rounded-full object-cover"
              />
              <div className="text-gray-7 dark:text-gray-1 flex flex-col">
                <span className="font-medium">{trip.driverInfo.fullName}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium pt-1.5">{trip.driverInfo.rating}</span>
                  <Rating
                    initialValue={trip.driverInfo.rating}
                    fillColor="#ffffff"
                    emptyColor="#706562"
                    size={18}
                    readonly
                    SVGstyle={{ display: "inline" }}
                    allowFraction
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Datos del vehículo */}
          <div className="col-span-6 row-span-2 row-start-9 bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl justify-center p-2">
            <h2 className="text-gray-7 self-start dark:text-gray-1 font-medium text-xl mb-2">
              Datos del vehículo
            </h2>
            <div className="flex items-center gap-2">
              <Image
                src={`/${trip.vehicle.vehicleTypeName.toLowerCase()}.png`}
                alt="Car logo"
                width={75}
                height={75}
                className="ml-3"
              />
              <div className="flex flex-col">
                <span>
                  {capitalizeWords(trip.vehicle.brand)}{" "}
                  {capitalizeWords(trip.vehicle.model)}
                </span>
                <span>{trip.vehicle.domain}</span>
                <span>Color: {capitalizeWords(trip.vehicle.color)}</span>
              </div>
            </div>
          </div>

          {/* Equipaje */}
          <div className="col-span-3 col-start-7 row-span-2 row-start-9 bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl justify-center items-center p-2">
            <h2 className="text-gray-7 dark:text-gray-1 font-medium text-xl mb-2">
              Equipaje
            </h2>
            <div className="flex flex-col items-center text-gray-7 dark:text-gray-1">
              <div className="flex gap-2">
                {BaggageIcon && (
                  <div className="rounded-lg">
                    <BaggageIcon className="w-10 h-10" />
                  </div>
                )}
              </div>
              <span className="font-medium text-xl">{selectedBaggage?.type}</span>
            </div>
          </div>

          {/* Botón reservar */}
          <div className="col-span-9 row-span-1 row-start-11 flex justify-center items-center mt-4">
            <Button
              type="button"
              variant="primary"
              className="px-12 py-2 text-sm font-inter font-medium md:mb-4"
              onClick={handleOpenModal}
              disabled={trip.currentAvailableSeats <= 0}
            >
              {trip.currentAvailableSeats > 0 ? 'Solicitar reserva' : 'Reservas no disponibles'}
            </Button>
          </div>
        </div>

        <ReservationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          trip={trip}
          initialOriginId={searchContext?.originId} 
          initialDestinationId={searchContext?.destinationId} 
          onSubmit={handleReservationSubmit}
        />

        {alertData && (
          <AlertDialog
            isOpen={!!alertData}
            onClose={() => setAlertData(null)}
            type={alertData.type === "success" ? "success" : "error"}
            title={alertData.title}
            description={alertData.description}
            confirmText="Aceptar"
            onConfirm={()=>router.back()}
          />
        )}
      </div>
    );
  }
}
