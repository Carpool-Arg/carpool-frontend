'use client'

import { useEffect, useState } from "react";
import { driverVerifyLicense, getDriversPending } from "@/services/admin/licence/licenseService";
import { LicenseVerifyDTO } from "../types/licenseVerify";
import { VoidResponse } from "@/shared/types/response";
import { DriverPendingDTO } from "../types/driverPending";

export function useDriversPending() {
  const [driversPending, setDriversPending] = useState<DriverPendingDTO[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginado
  const [skip, setSkip] = useState(0);
  const [orderBy, setOrderBy] = useState<string>("");
  const [total, setTotal] = useState<number>(0)

  const fetchDrivers = async (customSkip = skip, customOrderBy = orderBy) => {
    setLoading(true);
    setError(null);

    const res = await getDriversPending(customSkip, customOrderBy);

    if (res.state === "ERROR") {
      setError(res.messages?.[0] || "Error al cargar conductores");
      setDriversPending([]);
      setTotal(0)
    } else {
      setDriversPending(res.data?.drivers);
      setTotal(res.data?.total ?? 0);
    }

    setLoading(false);
  };

  const verifyLicense = async (driverId: number, data: LicenseVerifyDTO) => {
    const res: VoidResponse = await driverVerifyLicense(driverId, data);

    if (res.state === "ERROR") {
      setError(res.messages?.[0] || "Error al validar la licencia");
      return res; 
    }

    await fetchDrivers();

    return res;
  };

  useEffect(() => {
    fetchDrivers();
  }, [skip, orderBy,fetchDrivers]);

  return {
    driversPending,
    loading,
    error,
    skip,
    setSkip,
    orderBy,
    total,
    setOrderBy,
    refetch: fetchDrivers,
    verifyLicense, 
  };
}