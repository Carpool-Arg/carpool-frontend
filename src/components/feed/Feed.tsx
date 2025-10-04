'use client'

import { useGeocode } from "@/hooks/useGeocode"
import { fetchCityByName } from "@/services/cityService";
import { City } from "@/types/city";
import { useEffect, useState } from "react"
import TripList from "./TripList";

export default function Feed() {
  const { city, loading, error, detectUserCity } = useGeocode();
  const [currentCity, setCurrentCity] = useState<City | null>()

  useEffect(() => {
    detectUserCity(); // apenas se monta el componente detecta la ciudad
  }, []);

  useEffect(() => {
    if (city) {
      const fetchCityId = async () => {
        try {
          const response = await fetchCityByName(city)
          
          if (response.state === 'OK' ||response.data) {
            setCurrentCity(response?.data)
          }
        } catch (err) {
          console.error("Error trayendo ID de la ciudad:", err)
        }
      }
      fetchCityId()
    }
  }, [city])

  return (
    <div>
      {loading && "Detectando ciudad..."}
      {error && `Error: ${error}`}
      <TripList cityId={currentCity?.id!}/>
    </div>
  )
}
