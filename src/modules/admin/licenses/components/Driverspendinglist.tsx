'use client'

import { EmptyAlert } from "@/components/ux/EmptyAlert";
import { useDriversPending } from "../hooks/useDriverPending";
import { DriversPendingTable } from "./Driverspendingtable";
import { IdCard } from "lucide-react";

export function DriversPendingList() {
  const { driversPending, loading, error, verifyLicense, refetch } = useDriversPending();

  if (loading) return <p className="text-gray-300">Cargando conductores...</p>;

  if (error)
    return (
      <div className="flex flex-col gap-2 text-gray-300">
        <p className="text-red-500">{error}</p>
        <button onClick={refetch} className="text-sm underline text-gray-300">
          Reintentar
        </button>
      </div>
    );

  if (!driversPending || driversPending.length === 0)
    return (
      <div className="bg-dark-5 h-48 rounded-2xl flex items-center border-2 border-dashed">
        <EmptyAlert
          icon={<IdCard size={32} />}
          title="No hay licencias"
          description="Todavía no hay ninguna licencia para validar."
        />
      </div>
    );

  return <DriversPendingTable drivers={driversPending} onVerify={verifyLicense} />;
}