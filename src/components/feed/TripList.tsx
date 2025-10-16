"use client";

import { useEffect, useRef, useState } from "react";
import { formatFullDate, formatISODate, parseLocalDate } from "@/utils/date";
import Trip from "./Trip";
import { SearchData } from "@/types/response/trip";

interface TripListProps {
  feed: SearchData[] | [];
  currentCity?: string;
}

export default function TripList({ feed, currentCity }: TripListProps) {
  const [visibleCount, setVisibleCount] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  if (!feed || feed.length === 0) return <p>No hay viajes disponibles.</p>;

  let lastDate = "";

  // --- Observer para detectar el scroll ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          // Cargar 5 más cuando el sentinela sea visible
          setVisibleCount((prev) => Math.min(prev + 1, feed.length));
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

  // --- Lista visible según el contador ---
  const visibleTrips = feed.slice(0, visibleCount);

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
            <Trip trip={trip} currentCity={currentCity!} />
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
