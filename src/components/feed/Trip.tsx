
import { ChevronRight, Circle, Info, Square, Star } from "lucide-react";
import Image from "next/image";
import Separator from "../ui/ux/Separator";
import { capitalizeWords, formatTime, formatTimeRounded } from "@/utils/string";
import RouteLine from "./RouteLine";
import { formatPrice } from "@/utils/number";
import { SearchData } from "@/types/response/trip";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";


interface TripCardProps {
  trip: SearchData;
  currentCity: string
}

export default function Trip({ trip, currentCity }: TripCardProps) {

  const originIndex = trip.tripStops.findIndex(
    (stop) => stop.cityName.toLowerCase() === currentCity.toLowerCase()
  );

  // Si no lo encuentra, fallback al primer stop
  const originStop = originIndex !== -1 ? trip.tripStops[originIndex] : trip.tripStops[0];

  // La ciudad de origen del viaje (primer parada)
  const tripOriginCity = trip.tripStops[0].cityName;

  // El destino siempre es el último stop
  const destinationStop = trip.tripStops[trip.tripStops.length - 1];

  const isActualOrigin =
    currentCity.toLowerCase() === tripOriginCity.toLowerCase();

  const isRealOrigin = originStop.destination === false && originStop.start===true
  const isDestination = originStop.destination === true && originStop.start===false
  const isIntermediate = originStop.destination === false && originStop.start===false


  return (
    <div  className={`trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-200 ${
        isIntermediate
          ? "bg-gray-2/20"
          : "border-gray-2"
      }`}>
      <div className="flex items-center ">
        <div className="flex flex-col w-full mb-2">
          <div className="flex items-start justify-between w-full">
            <div className="grid grid-cols-2 w-3/4">
              {/* Fila de horarios */}
              <div className="w-full">
                <div className="flex items-center">
                  <p>{formatTime(originStop.estimatedArrivalDateTime)}</p>
                  <RouteLine/>
                </div>
                
              </div>
              <div>
                <p>{formatTimeRounded(destinationStop.estimatedArrivalDateTime)}</p>
              </div>

              {/* Fila de ciudades */}
              <div>
                <p className="text-sm">{capitalizeWords(originStop.cityName)}</p>
                <p className="text-xs text-gray-11">{capitalizeWords(originStop.observation)}</p>
              </div>
              <div>
                <p className="text-sm">{capitalizeWords(destinationStop.cityName)}</p>
                <p className="text-xs text-gray-11">{capitalizeWords(destinationStop.observation)}</p>
              </div>
            </div>
           
            <div className="">
              {isActualOrigin ? 
                <p className="text-xl font-semibold">${formatPrice(trip.seatPrice)}</p>
              : 
                <p className="text-lg text-gray-11">$ a definir</p>
              }
              <p className="flex items-center justify-end text-xl">
                <span><MdOutlineAirlineSeatReclineNormal /></span>
                {trip.availableSeat}
              </p>
            </div>
          </div>
         
        </div>

      </div>
      {isIntermediate && 
        <p className="flex items-center gap-1 text-xs">
          <span>
            <Info size={14}/>
          </span>
          El viaje inicia desde <span className="font-semibold">{capitalizeWords(tripOriginCity)}.</span>
        </p>}
      <Separator color="bg-gray-2" marginY="my-2"/>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src={trip.driverInfo.profileImageUrl}
              alt={trip.driverInfo.fullName}
              width={25}
              height={25}
              className="rounded-full object-cover border"
            />
            
            <p>{trip.driverInfo.fullName}</p>
          </div>
          
          <div className="border-l border-gray-2 px-4">
            <p
              className={`flex items-center gap-1 ${
                trip.driverInfo.rating >= 4
                  ? "text-success"
                  : trip.driverInfo.rating >= 3
                  ? "text-warning"
                  : "text-error"
              }`}
            >
              {trip.driverInfo.rating}
              <span>
                <Star size={12} fill="currentColor" />
              </span>
            </p>
          </div>
        </div>
        <ChevronRight size={20} strokeWidth={1}/>
      </div>
      
    </div>
  );
}
