import DriverReviews from "@/modules/review/components/driver/driverReviews";

export default function DriverReviewsPage(){
  return(
    <div className="max-w-lg mx-auto">
      <div className="md:mt-4 lg:mt-4 flex items-center justify-center w-full">
      <DriverReviews />
      </div>
    </div>
  )
}