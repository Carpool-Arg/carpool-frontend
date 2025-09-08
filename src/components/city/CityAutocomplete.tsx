"use client";

import { useState, useEffect } from "react";
import { fetchCities } from "@/services/cityService";
import { CityResponse } from "@/types/response/city";
import { City } from "@/types/city";

interface CityAutocompleteProps {
  value: number | null; // ahora el formulario maneja el id
  onChange: (value: number) => void;
  error?: string;
  label:string;
}

export function CityAutocomplete({ label, value, onChange, error }: CityAutocompleteProps) {
  const [query, setQuery] = useState(""); // texto que escribe el usuario
  const [cities, setCities] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const response: CityResponse = await fetchCities(query);
          setCities(response?.data ?? []);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setCities([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (city: City) => {
    setQuery(city.name);       // mostrar nombre en el input
    onChange(city.id);          // enviar id al formulario
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Escribe una ciudad..."
        className="w-full p-2 border dark:border-gray-2 rounded"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {showDropdown && cities.length > 0 && (
        <ul className="absolute z-10 w-full dark:bg-dark-5 border dark:border-gray-2 rounded mt-1 max-h-40 overflow-y-auto shadow">
          {cities.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSelect(city)}
              className="p-2 cursor-pointer dark:hover:bg-gray-2"
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
