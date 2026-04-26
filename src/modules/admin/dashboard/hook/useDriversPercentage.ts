'use client'

import { getDriversPercentage } from "@/services/admin/stats/adminStatsService";
import { useEffect, useState } from "react";
import { DriversPercentageResponseDTO } from "../types/dto/driversPercentageResponse";


export function useDriversPercentage(
  fromDate: string,
  toDate: string,
) {
  const [data, setData] = useState<DriversPercentageResponseDTO | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDriversPercentage = async () => {
    setLoading(true);
    setError(null);

    const res = await getDriversPercentage(fromDate, toDate);


    if (res.state === "ERROR") {
      setError(res.messages?.[0] || "Error inesperado");
      setData(null);
    } else {
      setData(res.data ?? null);
    }

    setLoading(false);
  };

  
  useEffect(() => {
    if (fromDate && toDate) {
      fetchDriversPercentage();
    }
  }, [fromDate, toDate]);

  return {
    data,
    loading,
    error,
    refetch: fetchDriversPercentage
  };
}