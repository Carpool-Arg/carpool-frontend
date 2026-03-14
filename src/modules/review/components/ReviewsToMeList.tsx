import { UserReview } from "../types/UserReview";
import { UserReviewCard } from "./UserReviewCard";


interface ReviewsToMeListProps{
  reviews: UserReview[] | null | undefined;
  passenger: boolean
}

export function ReviewsToMeList({reviews, passenger}:ReviewsToMeListProps){
  if(reviews?.length === 0){
    return(
      <div className="text-center text-sm text-gray-600 py-10">
        Aún no te han realizado reseñas.
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