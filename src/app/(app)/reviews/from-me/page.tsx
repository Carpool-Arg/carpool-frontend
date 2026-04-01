import ReviewsFromMe from "@/modules/review/components/from-me/ReviewsFromMe";

export default function ReviewsFromMePage(){
  return(
    <div className="max-w-lg mx-auto">
      <div className="md:mt-4 lg:mt-4 flex items-center justify-center w-full">
      <ReviewsFromMe />
      </div>
    </div>
  )
}