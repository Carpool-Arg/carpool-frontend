import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import { VehicleResponseTripDTO } from "@/modules/driver-trips/types/vehicleTrip";
import { formatDateTime } from "@/shared/utils/dateTime";
import { formatDomain } from "@/shared/utils/domain";
import { getClockIcon } from "@/shared/utils/getTimeIcon";
import { ArrowDown, ArrowDownRight, ChevronRight, CornerDownRight, IterationCcw } from "lucide-react";
import Image from "next/image";

interface TripCardProps {
  trip: {
    id: number;
    startCity: string;
    destinationCity: string;
    startDateTime: string;
    currentAvailableSeats: number;
    seatPrice: number;
    vehicle: VehicleResponseTripDTO
  };
}

export function TripDriverCard({ trip }: TripCardProps) {
  const startDate = new Date(trip.startDateTime);
  const ClockIcon = getClockIcon(startDate);

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
      <div className="inline-flex items-center text-xs text-gray-6 mb-2 bg-gray-7 gap-1 px-2 py-1 rounded-xl font-inter">
        <span><ClockIcon size={14} /></span>
        <span>{formatDateTime(startDate?.toISOString())}</span>
      </div>

      {/* Info secundaria */}
      <div className="flex items-center justify-between text-xs text-gray-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative flex-shrink-0 ">
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
          className="
            flex items-center gap-1 text-base
            bg-gray-7 text-gray-6
            px-2 py-1 rounded-lg
            transition-all duration-200 ease-out
            hover:bg-gray-6 hover:text-gray-8 hover:font-semibold cursor-pointer
            hover:shadow-sm hover:-translate-y-[1px]
          "
        >
          <IterationCcw size={16} />
          Iniciar viaje
        </button>

      </div>
    </div>
  );
}
