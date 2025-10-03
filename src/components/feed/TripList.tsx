import { getInitialFeed } from "@/services/tripService";
import { FeedData } from "@/types/response/feed";
import { useEffect, useState } from "react";

interface TripListProps {
  cityId: number;
}

export default function TripList({ cityId }: TripListProps) {
  const [feed, setFeed] = useState<FeedData[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await getInitialFeed(cityId);
      if (response.state === "OK" && response.data) {
        setFeed(response.data);
      }
    } catch (error) {
      console.error("Error al cargar viajes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [cityId]);

  if (!feed && loading) {
    return <div>Cargando viajes...</div>;
  }

  return (
    <div>
      <button
        onClick={fetchFeed}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refrescar viajes
      </button>

      {feed && feed.length === 0 && <p>No hay viajes disponibles.</p>}

      {feed?.map((trip, index) => (
        <div key={index} className="trip-card mb-4 p-4 border rounded">
          <h3>{trip.driverInfo.fullName}</h3>
          <img
            src={trip.driverInfo.profileImageUrl}
            alt={trip.driverInfo.fullName}
            width={50}
          />
          <p>⭐ {trip.driverInfo.rating}</p>
          <p>Fecha de salida: {new Date(trip.startDateTime).toLocaleString()}</p>
          <p>Asientos disponibles: {trip.availableSeat}</p>
          <p>Precio por asiento: ${trip.seatPrice}</p>

          <h4>Paradas:</h4>
          <ul>
            {trip.tripStops.map((stop, i) => (
              <li key={i}>
                {stop.cityName} {stop.observation && `- ${stop.observation}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
