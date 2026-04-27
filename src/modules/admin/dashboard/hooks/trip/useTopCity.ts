'use client'

import { getTopDestinationCities, getTopOriginCities } from "@/services/admin/stats/adminStatsService";
import { useEffect, useState } from "react";
import { TopCityStatResponseDTO } from "../../types/dto/topCityStatResponse";


export function useTopOrigin(limit:number) {
  const [topOrigin, setTopOrigin] = useState<TopCityStatResponseDTO | null>();
  const [topDestination, setTopDestination] = useState<TopCityStatResponseDTO | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopOrigin = async () => {
    setLoading(true);
    setError(null);

    const res = await getTopOriginCities(limit);

    if (res.state === "ERROR") {
      setError(res.messages?.[0] || "Error inesperado");
      setTopOrigin(null);
    } else {
      setTopOrigin(res.data ?? null);
    }

    setLoading(false);
  };

  const fetchTopDestination = async () => {
    setLoading(true);
    setError(null);

    const res = await getTopDestinationCities(limit);

    if (res.state === "ERROR") {
      setError(res.messages?.[0] || "Error inesperado");
      setTopDestination(null);
    } else {
      setTopDestination(res.data ?? null);
    }

    setLoading(false);
  };

  
  useEffect(() => {
    fetchTopOrigin();
    fetchTopDestination();
  }, [limit]);

  return {
    topOrigin,
    topDestination,
    loading,
    error,
    refetch: fetchTopOrigin
  };
}