'use client'

import { useEffect, useState } from "react";
import { driverVerifyLicense, getDriversPending } from "@/services/admin/licence/licenseService";
import { DriverPendingResponse } from "../types/dto/driverPendingResponse";
import { LicenseVerifyDTO } from "../types/licenseVerify";
import { VoidResponse } from "@/shared/types/response";


export function useDriversPending() {
  const [driversPending, setDriversPending] = useState<DriverPendingResponse["data"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);

    const res = await getDriversPending();

    if (res.state === "ERROR") {
      setError(res.messages?.[0] || "Error al cargar conductores");
      setDriversPending(null);
    } else {
      setDriversPending(res.data);
    }

    setLoading(false);
  };

  // Nuevo: función para verificar licencia y actualizar la lista en vivo
  const verifyLicense = async (driverId: number, data: LicenseVerifyDTO) => {
    const res: VoidResponse = await driverVerifyLicense(driverId, data);

    if (res.state === "ERROR") {
      return res; // el componente puede mostrar un toast/error
    }

    // Actualizar la lista de conductores pendientes
    setDriversPending((prev) =>
      prev?.filter((d) => d.driverId !== driverId) || null
    );

    return res;
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    driversPending,
    loading,
    error,
    refetch: fetchDrivers,
    verifyLicense, 
  };
}