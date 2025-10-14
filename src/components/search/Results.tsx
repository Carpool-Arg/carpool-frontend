'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTrips } from "@/services/tripService";
import TripList from "@/components/feed/TripList";
import { SearchData } from "@/types/response/trip";
import { fetchCityById } from "@/services/cityService";
import TripSkeleton from "../feed/TripSkeleton";
import Separator from "../ui/ux/Separator";
import { capitalizeWords } from "@/utils/string";
import { Circle, Square } from "lucide-react";
import FilterBar from "./FilterBar";

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDateParam = searchParams.get("departureDate");

  const [feed, setFeed] = useState<SearchData[]>([]);
  console.log(feed)
  const [loading, setLoading] = useState(true);
  const [originCityName, setOriginCityName] = useState('');
  console.log(originCityName);
  const [destinationCityName, setDestinationCityName] = useState('');

  // Estados de filtros
  const [departureDate, setDepartureDate] = useState<string | undefined>(departureDateParam!);


  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [orderByDriverRating, setOrderByDriverRating] = useState(false);


  // Función que dispara la búsqueda
  const fetchTrips = async () => {
    if (!origin || !destination) return;

    setLoading(true);
    try {
      const filters: any = {
        originCityId: +origin,
        destinationCityId: +destination,
      };
      if (departureDate) filters.departureDate = departureDate;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;
      if (orderByDriverRating) filters.orderByDriverRating = orderByDriverRating;

      console.log('Filtros enviados al backend:', filters);

      const res = await getTrips(filters);
      const responseOriginCity = await fetchCityById(Number(origin));
      const responseDestinationCity = await fetchCityById(Number(destination));

      setOriginCityName(responseOriginCity.data?.name || '');
      setDestinationCityName(responseDestinationCity.data?.name || '');

      if (res.state === "OK" && res.data) {
        setFeed(res.data);
      } else {
        setFeed([]);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
      setFeed([]);
    } finally {
      setLoading(false);
    }
  };

  // Cada vez que cambien filtros o ciudades, refetch
  useEffect(() => {
    fetchTrips();

    const queryParams = new URLSearchParams();
    if (origin) queryParams.append("origin", origin);
    if (destination) queryParams.append("destination", destination);
    if (departureDate) queryParams.append("departureDate", departureDate);
    if (minPrice !== undefined) queryParams.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) queryParams.append("maxPrice", maxPrice.toString());
    if (orderByDriverRating) queryParams.append("orderByDriverRating", orderByDriverRating.toString());

    router.replace(`/search/results?${queryParams.toString()}`);
  }, [origin, destination, departureDate, minPrice, maxPrice, orderByDriverRating]);

  const clearFilters = () => {
    // Reset estados
    setDepartureDate(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setOrderByDriverRating(false);

    // Actualizar URL solo con origin y destination
    const queryParams = new URLSearchParams();
    if (origin) queryParams.append("origin", origin);
    if (destination) queryParams.append("destination", destination);

    router.replace(`/search/results?${queryParams.toString()}`);
  };


  if (loading) {
    return (
      <div className="w-full">
        {Array.from({ length: 2 }).map((_, i) => (
          <TripSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Info de ciudades */}
      <div className="border border-gray-2 rounded-2xl md:mt-4 p-2 flex items-center gap-3 px-3">
        <div className="flex flex-col items-center">
          <Circle size={8} fill="white" stroke="white" />
          <div className="w-0.5 h-4 bg-gray-5 my-1"></div>
          <Square size={8} fill="white" stroke="white" />
        </div>
        <div className="w-full">
          <h1>{capitalizeWords(originCityName)}</h1>
          <Separator marginY="my-1" color="bg-gray-2"/>
          <h2>{capitalizeWords(destinationCityName)}</h2>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        selectedDate={departureDate}
        onDateChange={(date: Date) => {
          const normalized = new Date(date);
          normalized.setHours(0, 0, 0, 0);
          setDepartureDate(normalized.toISOString().slice(0, 10)); // guardamos string
        }}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        sortByRating={orderByDriverRating}
        setSortByRating={setOrderByDriverRating}
        onClearFilters={clearFilters}
      />
      {/* Lista de viajes */}
      <TripList feed={feed} currentCity={originCityName} />
    </div>
  );
}
