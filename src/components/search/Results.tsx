'use client';

import TripList from "@/components/feed/TripList";
import { fetchCityById } from "@/services/cityService";
import { getTrips } from "@/services/tripService";
import { SearchData } from "@/types/response/trip";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TripSkeleton from "../feed/TripSkeleton";
import CitySearch from "./CitySearch";
import FilterBar from "./FilterBar";

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDateParam = searchParams.get("departureDate");

  const [originCity, setOriginCity] = useState<number | null>(origin ? Number(origin) : null);
  const [destinationCity, setDestinationCity] = useState<number | null>(destination ? Number(destination) : null);

  const [feed, setFeed] = useState<SearchData[]>([]);

  const [loading, setLoading] = useState(true);
  const [originCityName, setOriginCityName] = useState('');

  const [destinationCityName, setDestinationCityName] = useState('');

  // Estados de filtros
  const [departureDate, setDepartureDate] = useState<string | undefined>(departureDateParam!);


  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [orderByDriverRating, setOrderByDriverRating] = useState(false);


  // Función que dispara la búsqueda
  const fetchTrips = async () => {
    if (!originCity || !destinationCity) return;

    setLoading(true);
    try {
      const filters: any = {
        originCityId: +originCity,
        destinationCityId: +destinationCity,
      };
      if (departureDate) filters.departureDate = departureDate;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;
      if (orderByDriverRating) filters.orderByDriverRating = orderByDriverRating;

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
    if (!originCity || !destinationCity) return;
    fetchTrips();

    const queryParams = new URLSearchParams();
    queryParams.append("origin", originCity.toString());
    queryParams.append("destination", destinationCity.toString());
    if (departureDate) queryParams.append("departureDate", departureDate);
    if (minPrice !== undefined) queryParams.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) queryParams.append("maxPrice", maxPrice.toString());
    if (orderByDriverRating) queryParams.append("orderByDriverRating", orderByDriverRating.toString());

    router.replace(`/search/results?${queryParams.toString()}`);
  }, [originCity, destinationCity, departureDate, minPrice, maxPrice, orderByDriverRating]);


  const clearFilters = () => {
    // Reset estados
    setDepartureDate(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setOrderByDriverRating(false);

    // Actualizar URL solo con origin y destination
    const queryParams = new URLSearchParams();
    if (originCity) queryParams.append("origin", originCity.toString());
    if (destinationCity) queryParams.append("destination", destinationCity.toString());

    router.replace(`/search/results?${queryParams.toString()}`);
  };


  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        {/* Skeleton header de ciudades */}
        <div className="border border-gray-2 rounded-2xl md:mt-4 p-2 flex items-center gap-3 px-3">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 bg-gray-2 rounded-full animate-pulse" />
            <div className="w-0.5 h-4 bg-gray-2 my-1 animate-pulse" />
            <div className="h-2 w-2 bg-gray-2 rounded-full animate-pulse" />
          </div>
          <div className="w-full space-y-1">
            <div className="h-4 w-32 bg-gray-2 rounded animate-pulse" />
            <div className="w-full border-b bg-gray-2/70 my-2 animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-2 rounded animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-2 animate-pulse">
          <div className="h-5 w-1/4 bg-gray-2 rounded-lg" />
          <div className="h-5 w-1/6 bg-gray-2 rounded-lg" />
          <div className="h-5 w-1/6 bg-gray-2 rounded-lg" />
        </div>

        {/* Skeleton de trips */}
        {Array.from({ length: 2 }).map((_, i) => (
          <TripSkeleton key={i} />
        ))}
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-4">
      {/* Info de ciudades */}
      <div className="md:mt-4">
        <CitySearch
          originCity={originCity}
          destinationCity={destinationCity}
          setOriginCity={setOriginCity}
          setDestinationCity={setDestinationCity}
        />
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
