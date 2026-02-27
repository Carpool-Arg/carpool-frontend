import { formatDateTime } from "@/shared/utils/dateTime";
import { Rating } from "react-simple-star-rating";

interface ReviewCardProps{
  stars: number;
  description:string;
  createdAt: string;
}


export function ReviewCard({stars,description,createdAt}: ReviewCardProps){
  return(
    <div className="trip-card mb-4 px-4 pb-4 pt-2.5 border border-gray-2 rounded-lg shadow-sm transition-all duration-20">
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="font-medium pt-1.5">{stars}</span>
          <Rating
            initialValue={stars}
            fillColor="#ffffff"
            emptyColor="#706562"
            size={18}
            readonly
            SVGstyle={{ display: "inline" }}
            allowFraction
          />

        </div>
        <div className="pt-1.5">
          <span className="text-sm text-gray-11"> {formatDateTime(createdAt)}</span>
        </div>
      </div>

      <div>
        <span> {description}</span>
      </div>


    </div>
  )
}
