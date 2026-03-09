import { UserReview } from "../types/UserReview";
import { UserReviewCard } from "./UserReviewCard";


interface ReviewsToMeListProps{
  reviews: UserReview[] | null | undefined;
}

export function ReviewsFromMeList({reviews}:ReviewsToMeListProps){
  if(reviews?.length === 0){
    return(
      <div className="text-center text-sm text-gray-600 py-10">
        Aún no has realizado reseñas.
      </div>
    )
  }

  return(
    <div className="flex flex-col">
      {reviews?.map((review) => (
        <UserReviewCard key={review.id} review={review}/>
      ))}
    </div>
  )
}