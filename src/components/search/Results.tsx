'use client';

import TripList from "@/components/feed/TripList";
import { fetchCityById } from "@/services/cityService";
import { getTrips } from "@/services/tripService";
import { SearchData } from "@/types/response/trip";
import { TripFilters } from "@/types/trip";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TripSkeleton from "../feed/TripSkeleton";
import CitySearch from "./CitySearch";
import FilterBar from "./FilterBar";

export default function Results() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // --- Inicializamos desde URL ---
  const originParam = searchParams.get("origin");
  const destinationParam = searchParams.get("destination");
  const departureDateParam = searchParams.get("departureDate");
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const orderByRatingParam = searchParams.get("orderByDriverRating");

  // Ciudades seleccionadas
  const [originCity, setOriginCity] = useState<number | null>(originParam ? Number(originParam) : null);
  const [destinationCity, setDestinationCity] = useState<number | null>(destinationParam ? Number(destinationParam) : null);

  // Feed
  const [feed, setFeed] = useState<SearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [originCityName, setOriginCityName] = useState('');

  // Filtros
  const [departureDate, setDepartureDate] = useState<string | undefined>(departureDateParam ?? undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(minPriceParam ? Number(minPriceParam) : undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(maxPriceParam ? Number(maxPriceParam) : undefined);
  const maxSeatPrice = feed.length > 0 
  ? Math.max(...feed.map(item => item.seatPrice))
  : 10000;
  const [orderByDriverRating, setOrderByDriverRating] = useState(orderByRatingParam === "true");

  // --- Función para fetch ---
  const fetchTrips = async () => {
    if (!originCity || !destinationCity) return;

    setLoading(true);
    try {
      const filters: TripFilters = {
        originCityId: originCity,
        destinationCityId: destinationCity,
      };
      if (departureDate) filters.departureDate = departureDate;
      if (minPrice !== undefined) filters.minPrice = minPrice;
      if (maxPrice !== undefined) filters.maxPrice = maxPrice;
      if (orderByDriverRating) filters.orderByDriverRating = orderByDriverRating;

      const res = await getTrips(filters);
      const responseOriginCity = await fetchCityById(originCity);

      setOriginCityName(responseOriginCity.data?.name || '');

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

  // --- Cada vez que cambien filtros o ciudades ---
  useEffect(() => {
    if (!originCity || !destinationCity) return;

    fetchTrips();

    const queryParams = new URLSearchParams();
    queryParams.set("origin", originCity.toString());
    queryParams.set("destination", destinationCity.toString());
    if (departureDate) queryParams.set("departureDate", departureDate);
    if (minPrice !== undefined) queryParams.set("minPrice", minPrice.toString());
    if (maxPrice !== undefined) queryParams.set("maxPrice", maxPrice.toString());
    if (orderByDriverRating) queryParams.set("orderByDriverRating", orderByDriverRating.toString());

    router.replace(`/search/results?${queryParams.toString()}`);
  }, [originCity, destinationCity, departureDate, minPrice, maxPrice, orderByDriverRating, router]);

  // --- Limpiar filtros ---
  const clearFilters = () => {
    setDepartureDate(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setOrderByDriverRating(false);

    const queryParams = new URLSearchParams();
    if (originCity) queryParams.set("origin", originCity.toString());
    if (destinationCity) queryParams.set("destination", destinationCity.toString());

    router.replace(`/search/results?${queryParams.toString()}`);
  };

  // --- Skeleton loading ---
  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full">
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

        {Array.from({ length: 2 }).map((_, i) => (
          <TripSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="md:mt-4 flex items-center gap-2">
        <CitySearch
          originCity={originCity}
          destinationCity={destinationCity}
          setOriginCity={setOriginCity}
          setDestinationCity={setDestinationCity}
        />
      </div>

      <FilterBar
        selectedDate={departureDate}
        onDateChange={(date: Date) => {
          const normalized = new Date(date);
          normalized.setHours(0, 0, 0, 0);
          setDepartureDate(normalized.toISOString().slice(0, 10));
        }}
        minPrice={minPrice}
        maxPrice={maxPrice}
        maxSeatPrice={maxSeatPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        sortByRating={orderByDriverRating}
        setSortByRating={setOrderByDriverRating}
        onClearFilters={clearFilters}
      />

      <TripList feed={feed} currentCity={originCityName} />
    </div>
  );
}
