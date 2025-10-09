'use client';

import { useState } from "react";
import { CityAutocomplete } from "../city/CityAutocomplete";
import Separator from "../ui/Separator";
import { useRouter } from "next/navigation";
import { Calendar, Plus } from "lucide-react";

export default function SearchBar() {
  const [originCity, setOriginCity] = useState<number | null>(null);
  const [destinationCity, setDestinationCity] = useState<number | null>(null);
  const router = useRouter();

  const handleSearch = () => {
    router.push(`/search/results?origin=${originCity}&destination=${destinationCity}`);
  };

  return (
    <div className="shadow-lg w-full flex items-center gap-4">
      {/* Origen */}
      <div className="border px-1  border-gray-2 rounded-2xl w-full">
        <CityAutocomplete
          placeholder="Selecciona tu punto de partida"
          value={originCity}
          onChange={(city) => setOriginCity(city?.id ?? null)}
        />
        <Separator color="bg-gray-2" marginY="my-0"/>
        {/* Destino */}
        <CityAutocomplete
          placeholder="Selecciona tu destino"
          value={destinationCity}
          onChange={(city) => setDestinationCity(city?.id ?? null)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button 
          onClick={handleSearch}
          className="bg-gray-2 p-2 rounded-full">
          <Plus size={16}/>
        </button>
        <button className="bg-gray-2 p-2 rounded-full">
          <Calendar size={16}/>
        </button>
      </div>
      
    </div>
  );
}
