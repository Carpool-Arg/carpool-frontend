'use client';

import { useState } from "react";
import { CityAutocomplete } from "../city/CityAutocomplete";
import Separator from "../ui/ux/Separator";
import { useRouter } from "next/navigation";
import { Calendar1, Circle, Plus, Square } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

export default function SearchBar() {
  const [originCity, setOriginCity] = useState<number | null>(null);
  const [destinationCity, setDestinationCity] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    if (originCity) queryParams.append("origin", originCity.toString());
    if (destinationCity) queryParams.append("destination", destinationCity.toString());
    if (selectedDate) {
    // Convertimos la fecha seleccionada a string YYYY-MM-DD
    const departureDate = selectedDate.toISOString().slice(0, 10);
    queryParams.append("departureDate", departureDate);
}

    router.push(`/search/results?${queryParams.toString()}`);
  };

  return (
    <div className="shadow-lg w-full flex items-center gap-4">
      {/* Origen y destino */}
      <div className="border w-full border-gray-2 rounded-2xl  flex items-center gap-2 px-3">
        <div className="flex flex-col items-center">
          <Circle size={8} fill="white" stroke="white" />
          <div className="w-0.5 h-6 bg-gray-5 my-1"></div>
          <Square size={8} fill="white" stroke="white" />
        </div>
        <div className=" rounded-2xl w-full">
          <CityAutocomplete
            placeholder="Localidad origen"
            value={originCity}
            onChange={(city) => setOriginCity(city?.id ?? null)}
          />
          <Separator color="bg-gray-2" marginY="my-0" />
          <CityAutocomplete
            placeholder="¿Hacia donde?"
            value={destinationCity}
            onChange={(city) => setDestinationCity(city?.id ?? null)}
          />
        </div>
      </div>
      

      {/* Botones */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleSearch}
          className="bg-gray-2 p-2 rounded-full"
        >
          <Plus size={16} />
        </button>

        {/* Dialog para calendario */}
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogTrigger asChild>
            <button 
              className="bg-gray-2 p-2 rounded-full"
              onClick={() => setIsCalendarOpen(true)}
            >
              <Calendar1 size={16} />
            </button>
          </DialogTrigger>

          <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-md flex flex-col items-center gap-6">
            <DialogHeader>
              <DialogTitle>Selecciona una fecha</DialogTitle>
            </DialogHeader>
            <Calendar
              mode="single"
              onSelect={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              className="rounded-md border w-64 h-[320px]"
              classNames={{
                selected: "",
                today: "ring-1 ring-gray-5 rounded-lg",
                outside: "text-muted-foreground",
                
              }}
            />
          </DialogContent>

        </Dialog>
      </div>
    </div>
  );
}
