'use client'

import { TripDetailsData } from "@/types/response/trip";
import { useEffect, useState } from "react";
import { getTripDetails, verifyIfUserIsCreator } from "@/services/tripService";
import { baggageOptions } from "../trip/TripFrom";
import { useAuth } from "@/contexts/authContext";
import { TripRoutePreview } from "../trip/TripRoutePreview";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";
import { capitalizeWords } from "@/utils/string";
import { TripDetailSkeleton } from "./TripDetailSkeleton";
import { ErrorMessage } from "../ui/Error";
import { formatPrice } from "@/utils/number";
import { useParams } from "next/navigation";
import { Button } from "../ui/ux/Button";


export default function TripDetails() {
  const [trip, setTrip] = useState<TripDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const loadTrip = async () => {
      try {
        setLoading(true);
        if(!id) return
        
        const creatorRes = await verifyIfUserIsCreator(Number(id));

        if (creatorRes.data) {
          setError("No puedes ver los detalles de este viaje.");
          return;
        }else{
          const res = await getTripDetails(Number(id));
          if (res.state === "ERROR") {
            setError(res.messages[0]);
          }
          setTrip(res.data);
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const selectedBaggage = baggageOptions.find(
    (b) => b.value === trip?.availableBaggage
  );

  const BaggageIcon = selectedBaggage?.icon;

  if (loading) return TripDetailSkeleton();
  if (error) return <ErrorMessage message={error} />;

  if (trip) {
    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto h-screen mt-2">
        {/* Contenedor en grid */}
        <div
          className="w-full h-full grid grid-cols-9 gap-2"
        >
          {/* Disponibilidad */}
          <div className="col-span-5 bg-gray-6 dark:bg-gray-8 flex flex-col justify-center text-center rounded-xl p-3">
            <h2 className="text-gray-7 dark:text-gray-1 font-medium text-xl">
              Disponibilidad
            </h2>
            <span className="font-medium text-2xl">
            {trip.currentAvailableSeats}/{trip.availableSeat}
            </span>
          </div>

          {/* Precio */}
          <div className="col-span-4 col-start-6 bg-gray-6 dark:bg-gray-8 flex flex-col justify-center text-center rounded-xl p-3">
            <h2 className="text-gray-7 dark:text-gray-1 font-medium text-xl">
              Precio
            </h2>
            <span className="font-medium text-2xl"><b>${formatPrice(trip.seatPrice)}</b></span>
          </div>

          {/* Recorrido */}
          <div className="col-span-9 bg-gray-6 dark:bg-gray-8 rounded-xl flex flex-col">
            <h2 className="text-gray-7 mt-3 ml-3 dark:text-gray-1 font-medium text-xl">
              Recorrido
            </h2>
            <div className="ml-3 mt-2 flex items-center justify-center h-full">
              <TripRoutePreview
                tripStops={trip.tripStops.sort((a, b) => a.order - b.order)}
                withTimes = {true}
              />
            </div>
          </div>

          {/* Datos del conductor */}
          <div className="col-span-9 bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl p-3">
            <h2 className="text-gray-7 dark:text-gray-1 font-medium text-xl mb-2">
              Datos del conductor
            </h2>
            <div className="flex gap-5 items-center h-full">
              <img
                src={trip.driverInfo.profileImageUrl || '/default-profile.png'}
                alt="Foto de perfil"
                className="w-12 h-12 rounded-full object-cover"
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
          <div className="col-span-6 bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl justify-center p-2">
            <h2 className="text-gray-7 self-start dark:text-gray-1 font-medium text-xl mb-2 ">
              Datos del vehículo
            </h2>
            <div className="flex items-center gap-2 h-full">
              <Image
                src={`/${trip.vehicle.vehicleTypeName.toLowerCase()}.png`}
                alt="Car logo"
                width={60}
                height={60}
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
          <div className="col-span-3 col-start-7 bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl justify-center items-center p-2">
            <h2 className="text-gray-7 dark:text-gray-1 font-medium text-xl mb-2">
              Equipaje
            </h2>
            <div className="flex flex-col items-center text-gray-7 dark:text-gray-1 h-full justify-center">
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
          <div className="col-span-9 flex justify-center items-center mt-4">
            <Button
              type="button"
              variant="primary"
              className="px-12 py-2 mb-4 text-sm font-inter font-medium"
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
