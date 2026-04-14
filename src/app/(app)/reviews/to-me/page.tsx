import ReviewsToMe from "@/modules/review/components/to-me/ReviewsToMe";

export default function ReviewsFromMePage(){
  return(
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-center w-full">
      <ReviewsToMe />
      </div>
    </div>
  )
}