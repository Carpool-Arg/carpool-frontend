'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrips } from "@/services/tripService";
import TripList from "@/components/feed/TripList";
import { SearchData } from "@/types/response/trip";
import { fetchCityById } from "@/services/cityService";

export default function Results() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  const [feed, setFeed] = useState<SearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [originCityName,setOriginCityName] = useState('')

  useEffect(() => {
    const fetchFeed = async () => {
      if (!origin || !destination) return;

      setLoading(true);
      
      const filters = {
        originCityId: +origin,
        destinationCityId: +destination
      };

      const res = await getTrips(filters);
      const responseCity = await fetchCityById(Number(origin));
      setOriginCityName(responseCity.data?.name!)
      if (res.state === "OK" && res.data) {
        setFeed(res.data);
      } else {
        setFeed([]);
      }

      setLoading(false);
    };

    fetchFeed();
  }, [origin, destination]);

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <TripList feed={feed} currentCtiy={originCityName}/>
      )}
    </div>
  );
}
