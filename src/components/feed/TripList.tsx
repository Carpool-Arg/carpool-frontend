import { getInitialFeed } from "@/services/tripService";
import { FeedData } from "@/types/response/feed";
import { useEffect, useState } from "react";
import Trip from "./Trip";

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

      {feed && feed.length === 0 && <p>No hay viajes disponibles.</p>}

      {feed?.map((trip, index) => (
        <Trip key={index} trip={trip} />
      ))}
    </div>
  );
}
