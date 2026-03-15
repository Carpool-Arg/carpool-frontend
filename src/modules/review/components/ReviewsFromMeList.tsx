import { EmptyAlert } from "@/components/ux/EmptyAlert";
import { UserReview } from "../types/UserReview";
import { UserReviewCard } from "./UserReviewCard";
import { StarOff } from "lucide-react";


interface ReviewsFromMeListProps{
  reviews: UserReview[] | null | undefined;
  passenger: boolean
}

export function ReviewsFromMeList({reviews, passenger}:ReviewsFromMeListProps){
  if(reviews?.length === 0){
    return(
      <div>
        <EmptyAlert
          icon={<StarOff size={32} />}
          title="Aún no has realizado reseñas."
        />
      </div>
    )
  }

  return(
    <div className="flex flex-col">
      {reviews?.map((review) => (
        <UserReviewCard key={review.id} review={review} passenger={passenger}/>
      ))}
    </div>
  )
}