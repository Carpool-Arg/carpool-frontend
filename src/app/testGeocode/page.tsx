"use client";
import { useGeocode } from "@/hooks/useGeocode";
import { fetchCityByName } from "@/services/cityService";
import { City } from "@/types/city";
import { useState } from "react";

export default function LocationWidget() {
  const { city, coords, loading, error, detectUserCity, getCoordsFromCity } = useGeocode();
  const [input, setInput] = useState("");
  const [cityBd, setCityBd] = useState<City>();

  const handleSearch = () => {
    if (input.trim() !== "") {
      getCoordsFromCity(input);
    }
  };


const onSubmit = async (name:string) => {
  try {
    const response = await fetchCityByName(name)
    if (response.state === "ERROR") {
      return
    }
    const data = response?.data
    if(data){
      setCityBd(data)
    }
  } catch (error: unknown) {
    console.error("Error en onSubmit:", error)
  }
}

  return (
    <div className="p-4 border rounded-lg space-y-3 max-w-md">
      <button
        onClick={detectUserCity}
        className="px-3 py-2 bg-blue-600 text-white rounded w-full"
      >
        Obtener mi ciudad actual
      </button>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Buscar ciudad..."
          className="border p-2 rounded flex-1"
        />
        <button onClick={handleSearch} className="px-3 py-2 bg-green-600 text-white rounded">
          Buscar
        </button>
      </div>

      {loading && <p>⏳ Cargando...</p>}
      {error && <p className="text-red-600">❌ {error}</p>}

      {city && (
        <p>
          📍 <strong>{city}</strong>
        </p>
      )}
      {coords && (
        <p>
          🌍 Lat: {coords.lat}, Lon: {coords.lon}
        </p>
      )}
    <button
      onClick={() => city && onSubmit(city)}
      disabled={!city}
      className="px-3 py-2 bg-blue-600 text-white rounded w-full disabled:opacity-50"
    >
      Obtener ciudad BD
    </button>
            <p>
              <strong>{cityBd?.id}</strong>
            </p>
            <p>
              <strong>{cityBd?.name}</strong>
            </p>
        </div>
      );
}
