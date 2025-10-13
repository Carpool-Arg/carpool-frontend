import { formatDateLong, formatFullDate } from "@/utils/date";
import Trip from "./Trip";
import { SearchData } from "@/types/response/trip";


interface TripListProps {
  feed: SearchData[] | [];
  currentCity?: string;
}

export default function TripList({ feed, currentCity }: TripListProps) {
  if (!feed || feed.length === 0) return <p>No hay viajes disponibles.</p>;

  let lastDate = "";

  return (
    <div className="">
      {feed.map((trip, index) => {
        const tripDate = trip.startDateTime.split("T")[0]; // extraemos YYYY-MM-DD
        const showDateHeader = tripDate !== lastDate;
        lastDate = tripDate;

        return (
          <div key={index}>
            {showDateHeader && (
              <h1 className=" font-semibold mb-2">
                {formatFullDate(tripDate)}
              </h1>
            )}
            <Trip trip={trip} currentCity={currentCity!} />
          </div>
        );
      })}
    </div>
  );
}
