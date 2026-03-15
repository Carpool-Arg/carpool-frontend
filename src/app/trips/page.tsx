import TripHistory from "@/modules/history/components/TripHistory";


export default function HistoryPage() {
  return(
    <div className="max-w-lg mx-auto">
      <div className="md:mt-4 lg:mt-4 flex items-center justify-center w-full">
        <TripHistory/>
      </div>
    </div>
  )
}