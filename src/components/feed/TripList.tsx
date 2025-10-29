"use client";

import { City } from "@/types/city";
import { SearchData } from "@/types/response/trip";
import { formatFullDate, parseLocalDate } from "@/utils/date";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Trip from "./Trip";
import { useRouter } from "next/navigation";

interface TripListProps {
  feed: SearchData[] | [];
  currentCity?: string;
  originSearch?: City | null;
  destinationSearch?: City | null;
}

const SEARCH_CONTEXT_KEY = 'carpool_search_context';
const LOAD_SIZE = 5; // Tamaño de lote inicial y de carga

export default function TripList({ feed, currentCity, originSearch, destinationSearch }: TripListProps) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  console.log('originSearch',originSearch)
  console.log('destinationSearch',destinationSearch)


  const handleTripClick = (tripId: number) => {
    // 1. Crear el objeto de contexto con los IDs de la búsqueda
    const searchContext = {
      originId: originSearch?.id, 
      destinationId: destinationSearch?.id,
    };

    // 2. Guardar el contexto en sessionStorage
    sessionStorage.setItem(SEARCH_CONTEXT_KEY, JSON.stringify(searchContext));

    // 3. Navegar a la página de detalles
    router.push(`/trip/details/${tripId}`);
  };

  // --- Observer para detectar el scroll ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          // Cargar 5 más cuando el sentinela sea visible
          setVisibleCount((prev) => Math.min(prev + LOAD_SIZE, feed.length));
        }
      },
      {
        rootMargin: "200px", // empieza a cargar un poco antes del final
        threshold: 0.1,
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [feed.length]);

  //if (!feed || feed.length === 0) return <p>No hay viajes disponibles.</p>;

  // --- Lista visible según el contador ---
  const visibleTrips = feed.slice(0, visibleCount);
  let lastDate = "";
  return (
    <div className="">
      {visibleTrips.map((trip, index) => {
        const tripDate = parseLocalDate(trip.startDateTime.split("T")[0]);
        const tripDateString = tripDate.toISOString().slice(0, 10); // yyyy-mm-dd

        const showDateHeader = tripDateString !== lastDate;
        lastDate = tripDateString;

        return (
          <div key={index}>
            {showDateHeader && (
              <h1 className="font-semibold mb-2 text-lg">
                {formatFullDate((tripDate))}
              </h1>
            )}
            <div 
                onClick={() => handleTripClick(trip.tripId)} 
                className="cursor-pointer block" // Añadir cursor-pointer para mejor UX
            >
              <Trip 
                trip={trip} 
                currentCity={currentCity ?? 'Villa Maria'} 
                originSearch={originSearch} 
                destinationSearch={destinationSearch}
              /> 
            </div>
             {/* Preguntar si hace falt aun endpoint para la ciudad por defecto*/}
          </div>
        );
      })}

      {/* Loader o indicador al final */}
      {visibleCount < feed.length && (
        <div ref={loaderRef} className="py-4 text-center text-sm text-muted-foreground">
          Cargando más viajes...
        </div>
      )}
    </div>
  );
}
