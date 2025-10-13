"use client";

import { useState, useEffect } from "react";
import { Star, DollarSign, Calendar1, BrushCleaning } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" })
    .format(date)
    .replace(".", "")
    .replace(" ", "-");
}

interface FilterBarProps {
  selectedDate?: string; // fecha seleccionada en formato ISO (yyyy-mm-dd)
  onDateChange?: (date: Date) => void;

  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange?: (value: number) => void;
  onMaxPriceChange?: (value: number) => void;

  sortByRating?: boolean; // toggle para ordenar por puntuación descendente
  setSortByRating?: (active: boolean) => void;
  onClearFilters?: () => void;
}

export default function FilterBar({
  selectedDate,
  onDateChange,
  minPrice = 0,
  maxPrice = 10000,
  onMinPriceChange,
  onMaxPriceChange,
  sortByRating = false,
  setSortByRating,
  onClearFilters
}: FilterBarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [localMin, setLocalMin] = useState<number>(minPrice);
  const [localMax, setLocalMax] = useState<number>(maxPrice);
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);

  const hasActiveFilters =
  !!selectedDate ||
  (minPrice !== undefined && minPrice > 0) ||
  (maxPrice !== undefined && maxPrice < 10000) ||
  sortByRating;

  const handleMinChange = (value: number) => {
    const val = Math.min(value, localMax); // no puede superar al max
    setLocalMin(val);
  };

  const handleMaxChange = (value: number) => {
    const val = Math.max(value, localMin); // no puede ser menor al min
    setLocalMax(val);
  };

  const handleApplyPrice = () => {
    onMinPriceChange && onMinPriceChange(localMin);
    onMaxPriceChange && onMaxPriceChange(localMax);
    setIsPricePopoverOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* FILTRO FECHA */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogTrigger asChild>
          <button
            className={`flex items-center gap-1 px-3 py-1 border rounded-lg transition ${
              selectedDate ? "border-gray-6 bg-gray-8" : "border-gray-2"
            }`}
          >
            <Calendar1 size={14} />
            <span className="text-sm">
              {selectedDate
                ? formatShortDate(new Date(selectedDate))
                : "Seleccionar fecha"}
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-6">
          <DialogHeader>
            <DialogTitle>Selecciona una fecha</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="single"
            selected={selectedDate ? new Date(selectedDate) : undefined}
            onSelect={(date) => {
              if (date && onDateChange) {
                const normalized = new Date(date);
                normalized.setHours(0, 0, 0, 0);
                onDateChange(normalized);
              }
              setIsCalendarOpen(false);
            }}
            className="rounded-md border w-64 h-[320px]"
            classNames={{
              today: "ring-1 ring-gray-5 rounded-lg",
              outside: "text-muted-foreground",
            }}
          />
        </DialogContent>
      </Dialog>

      {/* FILTRO PRECIO */}
      <Popover open={isPricePopoverOpen} onOpenChange={setIsPricePopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className={`flex items-center gap-1 px-3 py-1 border rounded-lg border-gray-2  hover:bg-gray-2 transition ${minPrice && maxPrice ?"border-gray-6 bg-gray-8" : "border-gray-2" }`}
            onClick={() => setIsPricePopoverOpen(true)}
          >
            <DollarSign size={14} />
            <span className="text-sm">Precio</span>
          </button>
        </PopoverTrigger>

        <PopoverContent 
          className="w-64" 
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <p className="text-sm mb-2 font-medium">Rango de precio ($)</p>

          <Slider
            min={0}
            max={10000}
            step={100}
            value={[localMin, localMax]}
            onValueChange={(val) => {
              handleMinChange(val[0]);
              handleMaxChange(val[1]);
            }}
          />

          <div className="flex justify-between gap-2 mt-3">
            <div className="flex flex-col w-1/2">
              <span className="text-xs mb-1">Mínimo</span>
              <Input
                type="number"
                value={localMin}
                onChange={(e) => handleMinChange(parseInt(e.target.value, 10) || 0)}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col w-1/2">
              <span className="text-xs mb-1">Máximo</span>
              <Input
                type="number"
                value={localMax}
                onChange={(e) => handleMaxChange(parseInt(e.target.value, 10) || 0)}
                className="text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleApplyPrice}
            className="mt-4 w-full text-sm bg-gray-8 text-white rounded-lg py-1 hover:bg-gray-7 transition"
          >
            Aplicar
          </button>
        </PopoverContent>
      </Popover>

      {/* FILTRO ORDENAR POR PUNTUACIÓN */}
      <button
        className={`flex items-center gap-1 px-3 py-1 border rounded-lg border-gray-2 hover:bg-gray-2 transition ${
          sortByRating ? "border-gray-6 bg-gray-8" : ""
        }`}
        onClick={() => setSortByRating && setSortByRating(!sortByRating)}
      >
        <Star size={14} />
        <span className="text-sm">Puntuación</span>
      </button>
      {onClearFilters && hasActiveFilters &&(
        <button
          className="flex items-center gap-1 px-3 py-1 text-sm  rounded-xl bg-gray-2 transition"
          onClick={onClearFilters}
        >
          <span><BrushCleaning size={14}/></span>
          Limpiar filtros
          
        </button>
      )}
      
    </div>
  );
}