'use client'

import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import { useTrip } from "@/contexts/tripContext";
import { CurrentTripSkeleton } from "@/modules/feed/components/CurrentTripSkeleton";
import { timeUntil } from "@/shared/utils/dateTime";
import { capitalizeWords } from "@/shared/utils/string";
import { ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";

export default function CurrentTrip() {
  const {currentTrip, arriveNextStop,loading, arriveLoading } = useTrip();
  const route = currentTrip?.tripStops ?? [];
  const nextStop = route.find(
    stop => !stop.tripStop.start && !stop.arrivalDateTime
  )



  const arrivedCount = route.filter(s => s.arrivalDateTime).length - 1
  const totalSteps = route.length - 1
  const progressPercent = (arrivedCount / totalSteps) * 100
  
  const originStop = route.find(stop => stop.tripStop.start);
  const destinationStop = route.find(stop => stop.tripStop.destination);
  
  const isLastStop = nextStop?.tripStop.destination === true

  const currentStop =
    [...route]
      .filter(stop => stop.arrivalDateTime)
      .sort(
        (a, b) =>
          new Date(b.arrivalDateTime!).getTime() -
          new Date(a.arrivalDateTime!).getTime()
      )[0] ?? originStop


  const timeLeft = timeUntil(nextStop?.tripStop.estimatedArrivalDateTime);


  return (

    <div className="bg-gray-8/90 backdrop-blur rounded-xl p-6 space-y-4">
      {loading ? (
        <CurrentTripSkeleton />
      ) : (
        <>
        <div className="relative flex flex-col h-full">
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-4">
            <div/>
          
            <div className="flex flex-col gap-2">
              <div className="bg-gray-8/90 rounded-xl p-6 flex flex-col">
                <Image
                  src={`${R2_PUBLIC_PREFIX}/isologo-cropped.svg`}
                  alt="Isologo carpool"
                  width={36}
                  height={24}
                  className="dark:invert"
                />
                <h2 className="text-2xl font-semibold leading-tight my-4">
                  Modo conductor activado
                </h2>

                <p className="text-sm text-gray-6 bg-gray-7 rounded-lg p-3">
                  Durante el viaje solo se mostrarán las acciones necesarias para conducir.
                  Finaliza el viaje al llegar al destino para desbloquear funciones.
                </p>
              </div>
              <div className="bg-gray-8/90 backdrop-blur rounded-xl p-6 space-y-4">
                {/* Header */}
                <div>
                  <h1 className="text-2xl font-semibold">
                    {nextStop 
                      ? 'Inició el recorrido' 
                      : 'Finalizó el recorrido'
                    }
                  </h1>
                  {nextStop && 
                    <div className="flex items-center gap-2 font-semibold text-sm mt-1">
                      <span>{capitalizeWords(originStop?.tripStop.cityName)}</span>
                      <span className="px-0.5 py-0.5 bg-gray-7 rounded-full">
                        <ChevronRight size={14}/>
                      </span>
                      <span>{capitalizeWords(destinationStop?.tripStop.cityName)}</span>
                    </div>
                  }
                </div>

                <div className="w-full h-2 bg-gray-7 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  {nextStop &&
                    <div className="flex items-center gap-2 text-gray-6">
                      <span className="bg-gray-7 p-2 rounded-lg">
                        <MapPin size={14}/>
                      </span>
                      <p>Estás en {capitalizeWords(currentStop?.tripStop.cityName)}</p>
                    </div>
                  }
                  {/* Trip info */}
                  <div className="text-sm text-gray-6 space-y-1 bg-gray-7 p-3 rounded-lg">
                    <p className="text-base font-semibold">
                      {nextStop
                        ? `¡${capitalizeWords(nextStop.tripStop.cityName)} es la próxima parada!`
                        : "¡Destino alcanzado!"
                      }
                    </p>
                    {nextStop ?
                      <>
                        <p>Una distancia de {nextStop?.distanceFromPrevious.toFixed(2)} km</p>
                        <p>
                          {timeLeft
                            ? `Llegada aproximada en ${timeLeft}`
                            : "Calculando tiempo de llegada…"}
                        </p>
                      </>
                    :
                      <p>Serás redireccionado a los detalles del viaje.</p>
                    }
                    
                  </div>
                </div>
                
                {/* Safety note */}
                
                {/* Action */}
                <div className="flex items-center justify-end pt-2">
                  {nextStop && (
                    <button
                      className="bg-gray-6 text-gray-8 px-4 py-2 rounded-lg font-medium cursor-pointer disabled:opacity-60"
                      onClick={arriveNextStop}
                      disabled={arriveLoading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className=" h-4 w-4 animate-spin rounded-full border-2 border-gray-2 border-t-transparent"></div>
                        </div>
                      ) : (
                        nextStop
                          ? `Llegué a ${capitalizeWords(nextStop.tripStop.cityName)}`
                          : isLastStop && "Finalizar viaje"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
    
  );
}
