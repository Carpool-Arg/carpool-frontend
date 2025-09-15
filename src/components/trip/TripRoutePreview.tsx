import { TripStop } from "@/types/tripStop";


interface TripRoutePreviewProps {
  originCityId: number;
  destinationCityId: number;
  tripStops: TripStop[];
}


export function TripRoutePreview({ tripStops }: { tripStops: TripStop[] }) {
    console.log(tripStops)
  return (
    <ol className="border-l-2 border-gray-300 dark:border-gray-600">
      {tripStops.map((stop, index) => (
        <li key={index} className="mb-4 ml-4">
          {stop.start && (
            <span className="text-green-600 font-medium">Inicio:</span>
          )}
          {!stop.start && !stop.destination && (
            <span className="text-blue-600 font-medium">Parada {index}:</span>
          )}
          {stop.destination && (
            <span className="text-red-600 font-medium">Destino:</span>
          )}

          {" "}{stop.cityName} {stop.observation && `- ${stop.observation}`}
        </li>
      ))}
    </ol>
  );
}
