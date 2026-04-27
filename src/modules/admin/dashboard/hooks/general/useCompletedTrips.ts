'use client'

import { getCompletedTrips } from "@/services/admin/stats/adminStatsService";
import { useEffect, useState } from "react";
import { getMonthRange, getPreviousMonthRange } from "../../helpers/stats";
import { AdminStatSimpleDTO } from "../../types/dto/adminStatSimpleResponse";

export function useCompletedTrips(fromDate: string, toDate: string) {
  const [filtered, setFiltered] = useState<AdminStatSimpleDTO | null>(null);
  const [currentMonth, setCurrentMonth] = useState<AdminStatSimpleDTO | null>(null);
  const [previousMonth, setPreviousMonth] = useState<AdminStatSimpleDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const current = getMonthRange();
      const previous = getPreviousMonthRange();

      const [filteredRes, currentRes, previousRes] = await Promise.all([
        getCompletedTrips(fromDate, toDate),
        getCompletedTrips(current.fromDate, current.toDate),
        getCompletedTrips(previous.fromDate, previous.toDate),
      ]);

      if (filteredRes.state === 'ERROR' || currentRes.state === 'ERROR' || previousRes.state === 'ERROR') {
        setError(
          filteredRes.messages?.[0] ||
          currentRes.messages?.[0]||
          previousRes.messages?.[0] ||
          "Error al obtener estadísticas"
        );
        return;
      }

      setFiltered(filteredRes.data ?? null);
      setCurrentMonth(currentRes.data ?? null);
      setPreviousMonth(previousRes.data ?? null);
    } catch {
      setError("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchAll();
    }
  }, [fromDate, toDate]);

  const delta =
    currentMonth && previousMonth
      ? currentMonth.totalFiltered - previousMonth.totalFiltered
      : null;

  return {
    filtered,
    currentMonth,
    previousMonth,
    delta,
    loading,
    error,
    refetch: fetchAll,
  };
}