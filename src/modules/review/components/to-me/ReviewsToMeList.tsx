import { EmptyAlert } from "@/components/ux/EmptyAlert";

import { StarOff } from "lucide-react";
import { UserReviewCard } from "../UserReviewCard";
import { UserReview } from "../../types/UserReview";


interface ReviewsToMeListProps{
  reviews: UserReview[] | null | undefined;
  passenger: boolean
}

export function ReviewsToMeList({reviews, passenger}:ReviewsToMeListProps){
  if(reviews?.length === 0){
    return(
      <div>
        <EmptyAlert
          icon={<StarOff size={32} />}
          title="Aún no te han realizado reseñas."
        />
      </div>
    )
  }

  return(
    <div className="flex flex-col">
      {reviews?.map((review) => (
        <UserReviewCard key={review.id} review={review} passenger={passenger} fromMe= {false}/>
      ))}
    </div>
  )
}