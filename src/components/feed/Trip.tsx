import { FeedData } from "@/types/response/feed";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import Separator from "../ui/Separator";
import { capitalizeWords, formatTime } from "@/utils/string";

interface TripCardProps {
  trip: FeedData;
}

export default function Trip({ trip }: TripCardProps) {
  return (
    <div className="trip-card mb-4 p-4 border border-gray-2 rounded shadow-sm min-w-lg">
      <div className="flex items-center">
        <div className="flex flex-col w-full">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-start justify-between w-2/3">
              <div className="w-auto">
                <p>{formatTime(trip.startDateTime)}</p>
                <p className="text-sm">{capitalizeWords(trip.tripStops[0].cityName)}</p>
              </div>
              <div className="flex-1 mx-2 my-3 border-t border-gray-2"></div>
              <div className="w-auto">
                <p>{formatTime(trip.startDateTime)}</p>
                <p className="text-sm">{capitalizeWords(trip.tripStops[trip.tripStops.length - 1].cityName)}</p>
              </div>
            </div>
            
            <p className="text-xl font-semibold">${trip.seatPrice}</p>
          </div>
          
        </div>

      </div>
      
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
            <p className="flex items-center gap-1">{trip.driverInfo.rating}
              <span><Star size={12} fill="white"/></span>
            </p>
          </div>
        </div>
        <ChevronRight size={20} strokeWidth={1}/>
      </div>
      
    </div>
  );
}
