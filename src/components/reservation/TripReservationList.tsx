'use client'

import { ReservationResponseDTO } from "@/types/response/reservationResponseDTO";
import { MapPinOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Reservation from "./Reservation";

interface TripReservationListProps{
  tripReservations: ReservationResponseDTO;
}

const LOAD_SIZE = 5;

export default function TripReservationList({tripReservations}: TripReservationListProps) {
  const [visibleCount, setVisibleCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
      const observer = new IntersectionObserver(
          (entries) => {
          const target = entries[0];
          if (target.isIntersecting) {
              // Cargar 5 más cuando el sentinela sea visible
              setVisibleCount((prev) => Math.min(prev + LOAD_SIZE, tripReservations.reservation.length));
          }
          },
          {
          rootMargin: "200px", // empieza a cargar un poco antes del final
          threshold: 0.1,
          }
      );

      const currentRef = loaderRef.current;

      if (currentRef) observer.observe(currentRef);

      return () => {
          if (currentRef) observer.unobserve(currentRef);
      };
  }, [tripReservations.reservation.length]);

  if (tripReservations.reservation.length === 0) {
    return (
        <div className="flex items-center justify-center p-4 gap-4 ">
            <div className="bg-dark-1 rounded-lg p-3">
                <MapPinOff size={32} />
            </div>
            <div className="border border-gray-6 h-12"></div>
            <div>
                <p className="text-lg font-medium leading-tight">Este viaje no tiene reservas.</p>
            </div>
        </div>
    );
  }

  const visibleReservations = tripReservations.reservation.slice(0, visibleCount);


  return (
      <div>
          {visibleReservations.map((reservation, index) => {
      
              return (
                  <div key={index}>

                  <div 
                      // onClick={() => handleTripClick(trip.id)} 
                      className="cursor-pointer block" // Añadir cursor-pointer para mejor UX
                  >
                      <Reservation 
                          {...reservation} 
                      /> 
                  </div>
                      {/* Preguntar si hace falt aun endpoint para la ciudad por defecto*/}
                  </div>
              );
              })}
      
              {/* Loader o indicador al final */}
              {visibleCount < tripReservations.reservation.length && (
              <div ref={loaderRef} className="py-4 text-center text-sm text-muted-foreground">
                  Cargando más reservas...
              </div>
          )}
      </div>
  )
}