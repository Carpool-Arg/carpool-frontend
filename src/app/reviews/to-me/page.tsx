import DriverReviews from "@/modules/review/components/driver/driverReviews";
import ReviewsFromMe from "@/modules/review/components/ReviewsFromMe";
import ReviewsToMe from "@/modules/review/components/ReviewsToMe";

export default function ReviewsFromMePage(){
  return(
    <div className="max-w-lg mx-auto">
      <div className="md:mt-4 lg:mt-4 flex items-center justify-center w-full">
      <ReviewsToMe />
      </div>
    </div>
  )
}