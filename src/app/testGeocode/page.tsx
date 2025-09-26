"use client";
import { useState } from "react";
import { useGeocode } from "@/hooks/useGeocode";

export default function LocationWidget() {
  const { city, coords, loading, error, detectUserCity, getCoordsFromCity } = useGeocode();
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (input.trim() !== "") {
      getCoordsFromCity(input);
    }
  };
  
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
    </div>
  );
}
