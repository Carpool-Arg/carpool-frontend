import { formatDateTime } from "@/shared/utils/dateTime";
import { Rating } from "react-simple-star-rating";

interface ReviewCardProps{
  stars: number;
  description:string;
  createdAt: string;
}


export function ReviewCard({stars,description,createdAt}: ReviewCardProps){
  return(
    <div className="trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-20">
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

      <div>
        <span> {description}</span>
      </div>

      <div>
        <span> {formatDateTime(createdAt)}</span>
      </div>
    </div>
  )
}
