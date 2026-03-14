import Image from "next/image";
import { Passenger } from "../../types/passenger";
import { Rating } from "react-simple-star-rating";
import { Star } from "lucide-react";

interface PassengerCardProps {
  passenger: Passenger;
  handlePassengerReview: () => void;
}

export default function PassengerCard({ passenger, handlePassengerReview }: PassengerCardProps) {
  return (
    <div className="p-4 rounded-xl bg-gray-8 shadow-sm transition w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 ">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={passenger.profilePhotoUrl}
              alt={`${passenger.passengerName} ${passenger.passengerLastname}`}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {passenger.passengerName} {passenger.passengerLastname}
            </span>

            <span className="text-xs text-gray-1/75">
              Pasajero
            </span>

          </div>
        </div>
        {!passenger.review &&
          <div>
            {/** BOTON PARA Reseñar */}
            <button 
              className="flex items-center gap-1 bg-gray-2 p-2 rounded-lg text-xs hover:bg-gray-7 cursor-pointer"
              onClick={handlePassengerReview}
            >
              <span><Star size={12} fill="currentColor"/></span>
              Reseñar pasajero
            </button>
          </div>
        }
      </div>
      {passenger.review &&
        <div className="flex flex-col p-2 text-gray-11/90">
          <p className="text-sm font-light text-gray-11/90">Tu opinión sobre este pasajero</p>
          <div className="flex items-center gap-1 px-1">
            <span className="font-medium text-sm pt-1.5">{passenger.review.stars}</span>
            <Rating
              initialValue={passenger.review.stars}
              fillColor="#c9c9c9"
              emptyColor="#706562"
              size={14}
              readonly
              SVGstyle={{ display: "inline" }}
              allowFraction
            />
          </div>
          <p className="text-sm px-2 py-1 italic">
            &quot;{passenger.review?.description}&quot;
          </p>
        </div>
      }
    </div>
  );
}