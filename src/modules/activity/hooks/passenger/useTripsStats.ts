'use client'

import { useEffect, useState } from "react";
import { PassengerStatResponse } from "@/modules/activity/types/dto/PassengerStatResponse";
import { getTripsStats } from "@/services/stats/statsService";
import { TripStat } from "../../types/TripsStat";

export function useTripsStats(
  fromDate: string,
  toDate: string,
  orderBy: string
) {
  const [data, setData] = useState<TripStat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    const res = await getTripsStats(fromDate, '24-04-2026', orderBy);
    
    if (res.state === "ERROR") {
      setError(res.messages?.[0] || "Error");
      setData(null);
    } else {
      setData(res.data ?? null);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchStats();
    }
  }, [fromDate, toDate, orderBy]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}