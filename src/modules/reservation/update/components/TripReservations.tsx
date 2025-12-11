'use client'

import { getReservations } from "@/services/reservation/reservationService";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import TripReservationList from "./TripReservationList";
import { BiError } from "react-icons/bi";
import TripSkeleton from "@/modules/feed/components/TripSkeleton";
import FilterBar from "./FilterBar";
import { ReservationDTO } from "../../create/types/reservation"; // Asegúrate de importar el tipo correcto

export default function TripReservations() {
  // Paginación
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(5); // El size suele ser constante
  const [hasMore, setHasMore] = useState<boolean>(true); // Para saber si quedan más datos

  // Filters
  const [nameState, setNameState] = useState<string | undefined>("PENDING");
  const [hasBaggage, setHasBaggage] = useState<boolean | undefined>(undefined);

  // Estados de carga y datos
  const [initialLoading, setInitialLoading] = useState(true); // Carga inicial (esqueletos)
  const [fetchingMore, setFetchingMore] = useState(false); // Carga de paginación (loader abajo)
  const [error, setError] = useState<string | null>(null);
  
  // Aquí guardamos el array acumulado de reservas
  const [reservationsList, setReservationsList] = useState<ReservationDTO[]>([]); 
  
  const { id } = useParams();

  // Resetear paginación y lista cuando cambian los filtros
  useEffect(() => {
    setPage(0);
    setReservationsList([]);
    setHasMore(true);
    setInitialLoading(true);
    // Nota: No llamamos a fetch aquí directamente, dejamos que el useEffect de abajo reaccione al cambio de page=0
  }, [nameState, hasBaggage, id]);

  useEffect(() => {
    const fetchTripReservations = async () => {
      if (!id) return;

      try {
        // Determinamos qué tipo de loading mostrar
        if (page === 0) setInitialLoading(true);
        else setFetchingMore(true);

        const response = await getReservations({
            idTrip: Number(id),
            nameState,
            baggage: hasBaggage
          },
          size,
          page
        );

        if (response.state === "ERROR") {
          setError(response.messages[0]);
        }

        if (response.state === "OK" && response.data) {
          const newReservations = response.data.reservation || [];

          // Si vienen menos datos que el tamaño de página, llegamos al final
          if (newReservations.length < size) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }

          // Si es la página 0, reemplazamos. Si no, concatenamos.
          setReservationsList(prev => {
            return page === 0 ? newReservations : [...prev, ...newReservations];
          });
        }
      } catch (error) {
        console.error("Error cargando las reservaciones del viaje:", error);
        setError("Error de conexión al cargar reservas.");
      } finally {
        setInitialLoading(false);
        setFetchingMore(false);
      }
    };

    fetchTripReservations();
  }, [id, nameState, hasBaggage, size, page]);

  // Función para pedir la siguiente página
  const handleLoadMore = useCallback(() => {
    if (hasMore && !fetchingMore && !initialLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, fetchingMore, initialLoading]);

  // Renderizado de Error
  if (error) {
    return (
      <div className="flex items-center justify-center p-4 gap-4 ">
        <div className="bg-dark-1 rounded-lg p-3">
          <BiError size={32} />
        </div>
        <div className="border border-gray-6 h-12"></div>
        <div>
          <p className="text-lg font-medium leading-tight">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <FilterBar
        nameState={nameState}
        setNameState={setNameState}
        hasBaggage={hasBaggage}
        setHasBaggage={setHasBaggage}
      />
      
      {initialLoading ? (
         <div className="w-full">
           {Array.from({ length: 2 }).map((_, i) => (
             <TripSkeleton key={i} />
           ))}
         </div>
      ) : (
        <TripReservationList 
            tripReservations={reservationsList} 
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoadingMore={fetchingMore}
        />
      )}
    </div>
  );
}