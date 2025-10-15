'use client'

import { useGeocode } from "@/hooks/useGeocode"
import { fetchCityByName } from "@/services/cityService";
import { City } from "@/types/city";
import { useEffect, useState } from "react"
import TripList from "./TripList";

import { getInitialFeed } from "@/services/tripService";
import TripSkeleton from "./TripSkeleton";
import { SearchData } from "@/types/response/trip";
import { normalizeText } from "@/utils/string";

export default function Feed() {
  const { city, error, detectUserCity } = useGeocode();
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [feed, setFeed] = useState<SearchData[] | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Detectar ciudad
        await detectUserCity();

        if (!city) return;

        // 2. Buscar cityId
        const responseCity = await fetchCityByName(normalizeText(city));
        if (responseCity.state === "OK" && responseCity.data) {
          setCurrentCity(responseCity.data);

          // 3. Buscar feed
          const responseFeed = await getInitialFeed(responseCity.data.id);
          if (responseFeed.state === "OK" && responseFeed.data) {
            setFeed(responseFeed.data);
          }
        }
      } catch (err) {
        console.error("Error cargando datos del feed:", err);
      } finally {
        if (city) setLoading(false);
      }
    };

    fetchData();
  }, [city]);

  if (loading) {
    return (
      <div className="w-full">
        {Array.from({ length: 2 }).map((_, i) => (
          <TripSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && `Error: ${error}`}
      <TripList feed={feed!} currentCity={currentCity?.name!}/>
    </div>
  );
}
