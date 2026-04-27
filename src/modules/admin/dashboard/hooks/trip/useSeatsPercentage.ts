'use client'

import { getSeatsPercentage } from "@/services/admin/stats/adminStatsService";
import { useEffect, useState } from "react";
import { TakenSeatsStatResponseDTO } from "../../types/dto/takenSeatsStatResponse";
import { getMonthRange, getPreviousMonthRange } from "../../helpers/stats";



export function useSeatsAnalytics(fromDate: string, toDate: string) {
  const [filtered, setFiltered] = useState<TakenSeatsStatResponseDTO | null>(null);
  const [currentMonth, setCurrentMonth] = useState<TakenSeatsStatResponseDTO | null>(null);
  const [previousMonth, setPreviousMonth] = useState<TakenSeatsStatResponseDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const current = getMonthRange();
      const previous = getPreviousMonthRange();

      const [filteredRes, currentRes, previousRes] = await Promise.all([
        getSeatsPercentage(fromDate, toDate), // gráfico
        getSeatsPercentage(current.fromDate, current.toDate), //  card actual
        getSeatsPercentage(previous.fromDate, previous.toDate), //  comparación
      ]);

      if (
        filteredRes.state === "ERROR" ||
        currentRes.state === "ERROR" ||
        previousRes.state === "ERROR"
      ) {
        setError("Error al obtener estadísticas");
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
      ? currentMonth.takenPercentageFiltered -
        previousMonth.takenPercentageFiltered
      : null;

  return {
    filtered,        // gráfico de barras
    currentMonth,    // card principal
    previousMonth,   // referencia
    delta,           // comparación
    loading,
    error,
    refetch: fetchAll,
  };
}