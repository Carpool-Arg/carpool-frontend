"use client";

import { useState, useEffect, ReactNode } from "react";
import { fetchCities } from "@/services/cityService";
import { CityResponse } from "@/types/response/city";
import { City } from "@/types/city";
import { Search } from "lucide-react"; // 👈 ícono de búsqueda

interface CityAutocompleteProps {
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
}

export function CityAutocomplete({
  label,
  value,
  onChange,
  error,
  placeholder,
  icon,
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(""); 
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
    setQuery(city.name);       
    onChange(city.id);         
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <label className="block mb-1 text-sm font-medium font-inter">{label}</label>

      <div className="relative">
        {/* Ícono a la izquierda */}
        {icon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-5">
            {icon}
          </span>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-2 border dark:border-gray-2 rounded text-white ${
            icon ? "pl-8" : ""
          } ${true ? "pr-8" : ""}`} 
        />

        {/* Ícono a la derecha (Search) */}
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-5">
          <Search className="w-4 h-4" />
        </span>
      </div>

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
