import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import { TripDriverDTO } from "@/types/tripDriverDTO";
import { formatISOToShortDate } from "@/utils/date";
import { formatTime } from "@/utils/dateTime";
import { formatPrice } from "@/utils/number";
import { capitalizeWords } from "@/utils/string";
import { ChevronRight, UserRound } from "lucide-react";
import Image from "next/image";
import RouteLine from "../feed/RouteLine";
import Separator from "../ux/Separator";

export interface MyTripProps{
    trip: TripDriverDTO
}

export default function MyTrip({trip}: MyTripProps) {
    return (
        <div className="mb-4 p-4 border border-gray-2 rounded-lg transition-all duration-200">
            <div className="flex items-start justify-between w-full">
                <div className="grid grid-cols-2 w-3/4">
                    <div className="w-full">
                        <div className="flex items-center">
                            <p>{formatTime(trip.startDateTime)}</p>
                            <RouteLine/>
                        </div>
                    </div>
                    <div>
                        <p>{formatTime(trip.estimatedArrivalDateTime)}</p>
                    </div>
                    <div>
                        <p className="text-sm">{capitalizeWords(trip.startCity ?? '')}</p>
                    </div>
                    <div>
                        <p className="text-sm">{capitalizeWords(trip?.destinationCity ?? '')}</p>
                    </div>
                </div>

                <div>
                    <p className="text-xl font-semibold">${formatPrice(trip.seatPrice)}</p>
                    <p className="flex items-center justify-end text-xl gap-1">
                    {trip.currentAvailableSeats}
                    <span><UserRound size={20}/></span>
                    </p>
                </div>
            </div>


            <Separator color="bg-gray-2" marginY="my-4"/>

                  
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                    <Image
                        src={`${R2_PUBLIC_PREFIX}/${(trip.vehicle.vehicleTypeName).toLowerCase()}.png`}
                        alt={`Imagen Tipo Vehiculo ${(trip.vehicle.vehicleTypeName).toLowerCase()}`}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                    />
                        <div className="leading-none">
                            <p className="font-semibold">{capitalizeWords(trip.vehicle.brand)}</p>
                            <p className="font-semibold">{capitalizeWords(trip.vehicle.model)}</p>
                            <p className="text-sm">{trip.vehicle.domain}</p>

                        </div>
                    </div>
                    
                    <div className="border-l border-gray-2 px-4">
                        <p
                        className="flex items-center gap-1"
                        >
                        {formatISOToShortDate(trip.startDateTime)}
                        </p>
                    </div>
                </div>
            
                <ChevronRight size={20} strokeWidth={1}/>

            </div>
        </div>
    )
}