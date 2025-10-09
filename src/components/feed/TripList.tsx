
import Trip from "./Trip";
import { SearchData } from "@/types/response/trip";

interface TripListProps {
  feed: SearchData[]|[];
  currentCtiy?: string;
}

export default function TripList({feed, currentCtiy}:TripListProps) {
  return (
    <div className="">
      {feed && feed.length === 0 && <p>No hay viajes disponibles.</p>}

      {feed?.map((trip, index) => (
        <Trip key={index} trip={trip} currentCity={currentCtiy!} />
      ))}
    </div>
  );
}
