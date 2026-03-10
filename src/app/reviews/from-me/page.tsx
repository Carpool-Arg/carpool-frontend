import DriverReviews from "@/modules/review/components/driver/driverReviews";
import ReviewsFromMe from "@/modules/review/components/ReviewsFromMe";

export default function DriverReviewsPage(){
  return(
    <div className="max-w-lg mx-auto">
      <div className="md:mt-4 lg:mt-4 flex items-center justify-center w-full">
      <ReviewsFromMe />
      </div>
    </div>
  )
}