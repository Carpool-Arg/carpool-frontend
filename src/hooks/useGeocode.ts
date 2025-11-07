"use client";
import { useCallback, useState } from "react";

interface Coordinates {
  lat: number;
  lon: number;
}

//Este hook nos permite comunicarnos con la API de OpenStreetMap y poder hacer varios metodos
export function useGeocode() {
  const [city, setCity] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Con este metodo podemos recuperar la ciudad segun la latitud y la longitud
  const getCityFromCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/geocode?type=reverse&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const name =
        data.address?.city || data.address?.town || data.address?.village || "Desconocida";

      setCity(name);
      setCoords({ lat, lon });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Este metodo nos devuelve las coordenadas de la ciudad segun su nombre
  const getCoordsFromCity = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/geocode?type=forward&query=${cityName}`);
      const data = await res.json();
      if (!data || data.length === 0) throw new Error("Ciudad no encontrada");

      const { lat, lon } = data[0];
      setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
      setCity(cityName);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Usar geolocalización del navegador
  // Debemos darle permisos al navegador para acceder a nuestra localizacion
  const detectUserCity = useCallback(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no está soportada en este navegador");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        getCityFromCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => setError("No se pudo obtener tu ubicación")
    );
  }, []);

  return {
    city,
    coords,
    loading,
    error,
    getCityFromCoords,
    getCoordsFromCity,
    detectUserCity,
  };
}
