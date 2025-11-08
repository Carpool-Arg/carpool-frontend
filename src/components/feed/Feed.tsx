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
import { useNotifications } from "@/hooks/useNotifications";

let initialized = false;

export default function Feed() {
  const { city, detectUserCity } = useGeocode();
  const { requestPermission } = useNotifications();
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [feed, setFeed] = useState<SearchData[] | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (initialized) return;
    initialized = true;
    const initNotifications = async () => {
      if (typeof window === "undefined" || !("Notification" in window)) return;
      try {
        // Pedir permiso usando el hook
        if (Notification.permission === 'default') {
          await requestPermission();
        }

      } catch (error) {
        console.warn('No se pudieron registrar las notificaciones:', error);
      }
    };
    initNotifications();
  }, [initialized,requestPermission]);

  useEffect(() => {
    // Solo se ejecuta una vez al montar
    detectUserCity();
  }, [detectUserCity]);

  useEffect(() => {
    if (!city) return; // Espera a que city esté disponible

    const fetchFeed = async () => {
      try {
        const responseCity = await fetchCityByName(normalizeText(city));
        if (responseCity.state === "OK" && responseCity.data) {
          setCurrentCity(responseCity.data);
          const responseFeed = await getInitialFeed(responseCity.data.id);
          if (responseFeed.state === "OK" && responseFeed.data) {
            setFeed(responseFeed.data);
          }
        }
      } catch (err) {
        console.error("Error cargando feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
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
      <TripList feed={feed ?? []} currentCity={currentCity?.name}/>
    </div>
  );
}
