import { formatDateTime } from "@/shared/utils/dateTime";
import { Rating } from "react-simple-star-rating";
import { UserReview } from "../types/UserReview";
import Image from "next/image";

interface ReviewCardProps{
  review: UserReview
  passenger: boolean
}


export function UserReviewCard({review, passenger}: ReviewCardProps){
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
          <span className="text-sm text-gray-11">{formatDateTime(review.createdAt)}</span>
        </div>
      </div>

            
      <div className="mb-4 mt-2 px-2">
        <span> {review.description}</span>
      </div>

      
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border">
          <Image
            src={review.profilePhotoUrl}
            alt='Foto de perfil del usuario'
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex flex-col leading-4">
          <p>{review.completeName}</p>
          <span className="text-sm text-gray-11"> {passenger ? 'Fue tu chofer el ' : 'Lo llevaste el '} {formatDateTime(review.tripDate)}</span>
        </div>

      </div>

      




    </div>
  )
}
