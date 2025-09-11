"use client";

import { useState, useEffect, ReactNode } from "react";
import { fetchCities, fetchCityById } from "@/services/cityService";
import { CitiesResponse, CityResponse } from "@/types/response/city";
import { City } from "@/types/city";
import { Search } from "lucide-react"; // 👈 ícono de búsqueda
import { capitalize, capitalizeWords } from "@/utils/string";

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
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const loadCity = async () => {
      if (value) {
        try {
          const city = await fetchCityById(value);
          setQuery(capitalizeWords(city.data?.name ?? ""));
          setSelected(true);
        } catch (err) {
          console.error(err);
        }
      }
    };
    loadCity();
  }, [value]);

  useEffect(() => {
    if (selected) {
      setSelected(false); 
      return;
    }
    const timeout = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const response: CitiesResponse = await fetchCities(query);
          setCities(
            (response?.data ?? []).map(c => ({
              ...c,
              name: capitalizeWords(c.name)
            }))
          );
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
    setSelected(true);       
    onChange(city.id);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <label className="block mb-1 text-sm font-medium font-inter">{label}</label>

      <div className="relative">
        {/* Ícono a la izquierda */}
        {icon && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 dark:text-gray-5 text-gray-2">
            {icon}
          </span>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-2 border border-gray-5 dark:border-gray-2 rounded ${
            icon ? "pl-8" : ""
          } ${true ? "pr-8" : ""}`} 
        />

        {/* Ícono a la derecha (Search) */}
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-2 dark:text-gray-5">
          <Search className="w-4 h-4" />
        </span>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {showDropdown && cities.length > 0 && (
        <ul className="absolute z-10 w-full bg-white text-gray-2 dark:bg-dark-5 border border-gray-5 dark:border-gray-2 rounded mt-1 max-h-40 overflow-y-auto shadow">
          {cities.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSelect(city)}
              className="p-2 cursor-pointer hover:bg-gray-1 dark:hover:bg-gray-2"
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
