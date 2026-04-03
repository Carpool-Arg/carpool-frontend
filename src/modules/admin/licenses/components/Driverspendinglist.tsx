'use client'

import { EmptyAlert } from "@/components/ux/EmptyAlert";
import { useDriversPending } from "../hooks/useDriverPending";
import { IdCard, OctagonX } from "lucide-react";
import { DriversPendingTable } from "./DriversPendingTable";
import Spinner from "@/components/ux/Spinner";
import { ErrorAlert } from "@/components/ux/admin/ErrorAlert";


export function DriversPendingList() {
  const {driversPending, loading, error, verifyLicense } = useDriversPending();

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 ml-55 mt-13">
        <Spinner />
      </div>
    );
  
  if (error)
    return (
      <div className="bg-dark-5 h-48 rounded-2xl flex items-center border border-gray-2/50">
        <ErrorAlert
          icon={<OctagonX size={32} />}
          title="Error"
          description={error}
        />
      </div>
    );

  if (!driversPending || driversPending.length === 0)
    return (
      <div className="bg-dark-5 h-48 rounded-2xl flex items-center border border-gray-2/50">
        <EmptyAlert
          icon={<IdCard size={32} />}
          title="No hay licencias"
          description="Todavía no hay ninguna licencia para validar."
        />
      </div>
    );

  return <DriversPendingTable drivers={driversPending} onVerify={verifyLicense} />;
}