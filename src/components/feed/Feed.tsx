'use client'

import { useGeocode } from "@/hooks/useGeocode"
import { City } from "@/types/city";
import { useEffect, useRef, useState } from "react"
import TripList from "./TripList";
import { getInitialFeed } from "@/services/tripService";
import TripSkeleton from "./TripSkeleton";
import { SearchData } from "@/types/response/trip";
import { useNotifications } from "@/hooks/useNotifications";

let initialized = false;

export default function Feed() {
  const { city, detectUserCity } = useGeocode();
  const { requestPermission } = useNotifications();
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [feed, setFeed] = useState<SearchData[] | null>(null);
  const [loading, setLoading] = useState(true); 


  const feedFetchRef = useRef(false);
  const detectCityRef = useRef(false);

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
    if (detectCityRef.current) return;
    detectCityRef.current = true; // Marca como ejecutado
    detectUserCity();
  }, []);

  useEffect(() => {
    if (!city) return; // Espera a que city esté disponible
    if (feedFetchRef.current) return;

    feedFetchRef.current = true; // Marca como ejecutado

    const fetchFeed = async () => {
      try {
        setCurrentCity(city);
        const responseFeed = await getInitialFeed(city.id);
        if (responseFeed.state === "OK" && responseFeed.data) {
          setFeed(responseFeed.data);
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
