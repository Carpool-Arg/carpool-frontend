import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import { TripDriverDTO } from "@/modules/driver-trips/types/tripDriver";
import { formatDateTime } from "@/shared/utils/dateTime";
import { formatDomain } from "@/shared/utils/domain";
import { getClockIcon } from "@/shared/utils/getTimeIcon";
import { capitalizeWords } from "@/shared/utils/string";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { tripButtonConfig } from "./TripStateButton";

interface TripCardProps {
  trip: TripDriverDTO  
}

export function TripDriverCard({ trip }: TripCardProps) {
  const [state, setState] = useState('CREATED')
  const startDate = new Date(trip.startDateTime);
  const ClockIcon = getClockIcon(startDate);
  const router = useRouter();

  const handleClick = () => {
    onClick(trip.id.toString());
  };

  /*
    const handleTripAction = () => {
      switch (state) {
        case "CREATED":
          router.push(`/current-trip`);
          break;

        case "FINISHED":
          router.push(`/driver/trip/${trip.id}/summary`);
          break;

        default:
          console.warn("Estado no manejado");
      }
    };
  */

  //Esto esta hardcodeado, luego de mergear con la rama para inciar viaje eso solo tendria que tener en cuenta el estado del viaje
  const config =
  tripButtonConfig[trip.tripState] ??
  tripButtonConfig["CREATED"];

  const { label, Icon, className, disabled, onClick} = config;
 
  return (
    <div  className="trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-20">
      {/* Ruta */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <span>{trip.startCity}</span>
          <span className="px-0.5 py-0.5 bg-gray-7 rounded-full"><ChevronRight size={14}/></span>
          <span>{trip.destinationCity}</span>
           
        </div>
        <span className="text-base font-semibold">
          ${trip.seatPrice}
        </span>
      </div>

      {/* Fecha */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center text-xs text-gray-6 mb-2 bg-gray-7 gap-1 px-2 py-1     rounded-xl font-inter">
          <span><ClockIcon size={14} /></span>
          <span>{formatDateTime(startDate?.toISOString())}</span>
        </div>
        <div className="inline-flex gap-2 items-center text-xs text-gray-6 mb-2 bg-gray-7 px-3 py-1 rounded-xl font-inter">
          <span>{capitalizeWords(trip.tripState)}</span>
          <span className="bg-white h-1.5 w-1.5 rounded-full"></span>
        </div>
      </div>
      

      {/* Info secundaria */}
      <div className="flex items-center justify-between text-xs text-gray-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative shrink-0 ">
            <Image
              src={`${R2_PUBLIC_PREFIX}/${(trip.vehicle.vehicleTypeName).toLowerCase()}.png`}
              alt={`Imagen Tipo Vehiculo ${(trip.vehicle.vehicleTypeName).toLowerCase()}`}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">
              {trip.vehicle.brand} {trip.vehicle.model}
            </span>
            <span className="font-inter">
              {formatDomain(trip.vehicle.domain)}
            </span>
          </div>
          
        </div>
        
        <button
          disabled={disabled}
          className={`
            flex items-center gap-1 text-base cursor-pointer
            px-2 py-1 rounded-lg
            transition-all duration-200 ease-out
            hover:shadow-sm hover:-translate-y- 
          bg-gray-7 text-gray-6
          hover:bg-gray-6 hover:text-gray-8 hover:font-semibold
            ${className}
          `}
          onClick={handleClick}
        >
          <Icon size={16} />
          {label}
        </button>

      </div>
    </div>
  );
}
