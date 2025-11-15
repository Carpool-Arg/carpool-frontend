import { TripDriverDTO } from "@/types/tripDriverDTO";
import RouteLine from "../feed/RouteLine";
import { capitalizeWords, formatTimeRounded } from "@/utils/string";
import { formatPrice } from "@/utils/number";
import { MdOutlineAirlineSeatReclineNormal } from "react-icons/md";
import Separator from "../ux/Separator";
import Image from "next/image";
import { ChevronRight, UserRound } from "lucide-react";
import { formatISOToShortDate } from "@/utils/date";
import { formatTime } from "@/utils/dateTime";

export default function MyTrip(trip: TripDriverDTO) {
    return (
        <div className="trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-200">
            <div className="flex items-center">
                <div className="flex flex-col w-full mb-2">
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
                </div>
            </div>

            <Separator color="bg-gray-2" marginY="my-2"/>

                  
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Image
                    src={`/${trip.vehicle.vehicleTypeName}.png`}
                    alt="Car logo"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                    <div className="leading-none">
                        <p>{capitalizeWords(trip.vehicle.brand)}, {capitalizeWords(trip.vehicle.model)}</p>
                        <p>{trip.vehicle.domain}</p>

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