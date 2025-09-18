"use client";

import { useState, useEffect, ReactNode } from "react";
import { fetchCities, fetchCityById } from "@/services/cityService";
import { CitiesResponse, CityResponse } from "@/types/response/city";
import { City } from "@/types/city";
import { Search, X } from "lucide-react"; 
import { capitalize, capitalizeWords } from "@/utils/string";

interface CityAutocompleteProps {
  value: number | null;
  onChange: (value: {id:number;name: string}  | null) => void;
  error?: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  excludeIds?: number[];
}

export function CityAutocomplete({
  label,
  value,
  onChange,
  error,
  placeholder,
  icon,
  excludeIds
}: CityAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const loadCity = async () => {
      if (value && !selected) {
        try {
          setLoading(true)
          const city = await fetchCityById(value);
          setQuery(capitalizeWords(city.data?.name ?? ""));
          setSelected(true);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }else if (!value) {
        setQuery("");
        setSelected(false);
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
          let filteredCities = (response?.data ?? []).map(c => ({
            ...c,
            name: capitalizeWords(c.name)
          }));

          // Filtrar los IDs excluidos
          if (excludeIds && excludeIds.length > 0) {
            filteredCities = filteredCities.filter(c => !excludeIds.includes(c.id));
          }

          setCities(filteredCities);
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
    onChange({id:city.id, name: city.name});
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <label className="block mb-2 text-sm font-medium font-inter">{label}</label>

      <div className="relative">
        {icon && !loading &&  (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-5 text-gray-2">
            {icon}
          </span>
        )}

        {loading ? (
          <div className={`relative h-10 w-full rounded border border-gray-5 dark:border-gray-2   animate-pulse ${icon ? "pl-8" : ""}`}>
            {/* placeholder falso */}
            <div className="absolute top-1/2 -translate-y-1/2 h-3 w-24 rounded bg-gray-300 dark:bg-gray-2" />
          </div>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setTyping(true); // ahora el usuario está escribiendo
              if (selected) setSelected(false); // solo quitamos la selección si ya había seleccionado
            }}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-5 dark:border-gray-2 rounded ${icon || selected ? "pl-8" : ""} pr-8`}
          />
        )}

        {/* Ícono a la derecha */}
        {!loading && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-2 dark:text-gray-5 cursor-pointer">
            {query ? (
              <X
                className="w-4 h-4"
                onClick={() => {
                  setQuery("");
                  setSelected(false);
                  onChange(null);
                }}
              />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </span>

        )}
      </div>


      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {showDropdown && cities.length > 0 && (
        <ul className="absolute z-10 w-full bg-white text-gray-2 dark:text-gray-1 dark:bg-dark-5 border border-gray-5 dark:border-gray-2 rounded mt-1 max-h-40 overflow-y-auto shadow">
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
