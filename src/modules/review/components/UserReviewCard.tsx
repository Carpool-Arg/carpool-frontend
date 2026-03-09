import { formatDateTime } from "@/shared/utils/dateTime";
import { Rating } from "react-simple-star-rating";
import { UserReview } from "../types/UserReview";
import Image from "next/image";

interface ReviewCardProps{
  review: UserReview
}


export function UserReviewCard({review}: ReviewCardProps){
  return(
    <div className="trip-card mb-4 px-4 pb-4 pt-2.5 border border-gray-2 rounded-lg shadow-sm transition-all duration-20">
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="font-medium pt-1.5">{review.stars}</span>
          <Rating
            initialValue={review.stars}
            fillColor="#ffffff"
            emptyColor="#706562"
            size={18}
            readonly
            SVGstyle={{ display: "inline" }}
            allowFraction
          />

        </div>
        <div className="pt-1.5">
          <span className="text-sm text-gray-11"> Fecha de la reseña: {formatDateTime(review.createdAt)}</span>
        </div>
      </div>

      <div>
        <span className="text-sm text-gray-11"> Fecha del viaje: {formatDateTime(review.tripDate)}</span>
      </div>

          <div className="flex items-center gap-2">
            <div className="relative w-6.25 h-6.25 rounded-full overflow-hidden border">
              <Image
                src={review.profilePhotoUrl}
                alt='Foto de perfil del usuario'
                fill
                className="object-cover"
              />
            </div>
            
            <p>{review.completeName}</p>
          </div>
      <div>
        <span> {review.description}</span>
      </div>


    </div>
  )
}
