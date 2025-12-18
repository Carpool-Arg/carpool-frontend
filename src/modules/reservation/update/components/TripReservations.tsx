'use client'

import { getReservations } from "@/services/reservation/reservationService";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import TripReservationList from "./TripReservationList";
import { BiError } from "react-icons/bi";
import TripSkeleton from "@/modules/feed/components/TripSkeleton";
import FilterBar from "./FilterBar";
import { ReservationDTO } from "../../create/types/reservation"; // Asegúrate de importar el tipo correcto
import { ChevronRight } from "lucide-react";
import { capitalizeWords } from "@/shared/utils/string";
import TripReservationsSkeleton from "./TripReservationsSekeleton";

export default function TripReservations() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  // Paginación
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(5); // El size suele ser constante
  const [hasMore, setHasMore] = useState<boolean>(true); // Para saber si quedan más datos

  // Filters
  const nameState = searchParams.get("state") ?? "PENDING";
  const [hasBaggage, setHasBaggage] = useState<boolean | undefined>(undefined);

  // Estados de carga y datos
  const [initialLoading, setInitialLoading] = useState(true); // Carga inicial (esqueletos)
  const [fetchingMore, setFetchingMore] = useState(false); // Carga de paginación (loader abajo)
  const [error, setError] = useState<string | null>(null);
  
  // Aquí guardamos el array acumulado de reservas
  const [reservationsList, setReservationsList] = useState<ReservationDTO[]>([]); 
  
  const totalReservations=reservationsList.length
  
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('')

  // Resetear paginación y lista cuando cambian los filtros
  useEffect(() => {
    setPage(0);
    setReservationsList([]);
    setHasMore(true);
    setInitialLoading(true);
    
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
          setOrigin(newReservations[0].startCity);
          setDestination(newReservations[0].destinationCity);
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
      {initialLoading ? (
        <>
          <TripReservationsSkeleton />

          <div className="w-full">
            {Array.from({ length: 2 }).map((_, i) => (
              <TripSkeleton key={i} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            {origin && destination && 
              <div className="flex items-center mb-2">
                <div className="font-inter bg-gray-7 rounded-full text-xs py-1 px-2">
                  {capitalizeWords(origin)}
                </div>
                <span>
                  <ChevronRight size={16} />
                </span>
                <div className="font-inter bg-gray-7 rounded-full text-xs py-1 px-2">
                  {capitalizeWords(destination)}
                </div>
              </div>
            }
            {nameState === 'PENDING' ? (
              <p className="font-inter text-sm">
                ¡Decidí quién viaja con vos! Tenés {totalReservations} solicitud
                {totalReservations !== 1 && "es"} de reserva.
              </p>
            ): (
              <p className="font-inter text-sm">
                ¡Elegiste quién viaja con vos! Aceptaste {totalReservations} reserva
                {totalReservations !== 1 && "s"}.
              </p>
            )}
            
          </div>
         
          {totalReservations !== 0 &&
            <div className="mb-4 mt-2">
              <FilterBar
                hasBaggage={hasBaggage}
                setHasBaggage={setHasBaggage}
              />
            </div>
          }
          

          <TripReservationList
            tripReservations={reservationsList}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoadingMore={fetchingMore}
          />
        </>
      )}
    </div>
  );
}