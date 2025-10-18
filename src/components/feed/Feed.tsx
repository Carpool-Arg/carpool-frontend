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
  const { city, detectUserCity } = useGeocode();
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [feed, setFeed] = useState<SearchData[] | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        await detectUserCity();

        // Esperar hasta 2 segundos para que city se actualice (opcional)
        const timeout = Date.now() + 2000;
        while (!city && Date.now() < timeout) {
          await new Promise((r) => setTimeout(r, 100));
        }

        let responseFeed;

        if (city) {
          // Buscar el ID de la ciudad detectada
          const responseCity = await fetchCityByName(normalizeText(city));

          if (responseCity.state === "OK" && responseCity.data) {
            setCurrentCity(responseCity.data);
            responseFeed = await getInitialFeed(responseCity.data.id);
          }
        } else {
          // Si no hay city => pedir feed sin parámetro (el backend decidirá la ciudad)
          responseFeed = await getInitialFeed();
        }

        if (responseFeed?.state === "OK" && responseFeed.data) {
          setFeed(responseFeed.data);
        }
      } catch (err) {
        console.error("Error cargando datos del feed:", err);
      } finally {
        setLoading(false);
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
      <TripList feed={feed!} currentCity={currentCity?.name}/>
    </div>
  );
}
