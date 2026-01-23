'use client'

import { Tab } from "@/components/ux/Tab";
import TripSkeleton from "@/modules/feed/components/TripSkeleton";
import { getReservations } from "@/services/reservation/reservationService";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BiError } from "react-icons/bi";
import { ReservationDTO } from "../../create/types/reservation"; // Asegúrate de importar el tipo correcto
import FilterBar from "./FilterBar";
import TripReservationList from "./TripReservationList";
import { RESERVATION_TABS } from "@/constants/tabs/reservation";

export default function TripReservations() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const searchParams = useSearchParams();
  // Paginación
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(5); // El size suele ser constante
  const [hasMore, setHasMore] = useState<boolean>(true); // Para saber si quedan más datos
  const [hasFilters, setHasFilters] = useState<boolean>(false);

  // Filters
  const nameState = searchParams.get("state") ?? "PENDING";

  // Estados de carga y datos
  const [initialLoading, setInitialLoading] = useState(true); // Carga inicial (esqueletos)
  const [fetchingMore, setFetchingMore] = useState(false); // Carga de paginación (loader abajo)
  const [error, setError] = useState<string | null>(null);
  
  // Array acumulado de reservas
  const [reservationsList, setReservationsList] = useState<ReservationDTO[]>([]); 


  const state = searchParams.get("state") ?? "PENDING";

  const baggageParam = searchParams.get("baggage");
  const hasBaggage = baggageParam === "true" ? true : baggageParam === "false" ? false : undefined;

  // Para cambiar el Tab (Estado)
  const handleChangeState = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("state", value);
    // Resetear equipaje al cambiar de tab si quisieras (opcional), sino lo dejas
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Para cambiar el Filtro (Equipaje)
  const handleBaggageChange = (value: boolean | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === undefined) {
      setHasFilters(false)
      params.delete("baggage"); // Si limpian el filtro, lo quitamos de la URL
    } else {
      setHasFilters(true)
      params.set("baggage", String(value)); // "true" o "false"
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
      <div className="flex items-center justify-center p-4 gap-4">
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
      <>
        <div className="mb-3">
        
          <h1 className="text-xl font-semibold mb-1">Reservas</h1>
          
          
          {reservationsList.length === 0 ? (
            <p className="font-inter text-sm text-gray-5">
              {nameState === 'PENDING'
                ? 'Todavía no hay solicitudes para este viaje.'
                : 'Aún no hay pasajeros confirmados para este viaje.'}
            </p>
          ) : nameState === 'PENDING' ? (
            <p className="font-inter text-sm">
              ¡Tenés interesados! Revisá quién quiere sumarse a tu viaje.
            </p>
          ) : (
            <p className="font-inter text-sm">
              ¡Equipo armado! Estos son los pasajeros que viajan con vos.
            </p>
          )}
          
        </div>

        <Tab value={state} onChange={handleChangeState} tabs={RESERVATION_TABS}/>
        {initialLoading ? 
          <div className="h-6 w-32 bg-gray-2 rounded-lg animate-pulse my-4" />
        :(
          <div className="mb-4 mt-4">
            <FilterBar
              hasBaggage={hasBaggage}
              setHasBaggage={handleBaggageChange}
            />
          </div>
        )}
        
      </>
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
          hasFilters={hasFilters}
        />
        
      )}
    </div>
  );
}