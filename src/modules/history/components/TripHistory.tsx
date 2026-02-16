'use client'

import { Toast } from "@/components/ux/Toast";
import { TripDriverDTO } from "@/modules/driver-trips/types/tripDriver";
import { getMyTrips } from "@/services/trip/tripService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TripDriverList } from "./driver/TripDriverList";
import TripHistoryHeader from "./TripHistoryHeader";

export default function TripHistory() { 
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const role = searchParams.get("role") ?? "passenger";

  const [driverTrips, setDriverTrips] = useState<TripDriverDTO[]>([]);

  const [toast, setToast] = useState<{ message: string; type: 'error' | 'warning' | 'success' } | null>(null);

  const handleChangeRole = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", value);
    // Resetear equipaje al cambiar de tab si quisieras (opcional), sino lo dejas
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchTrips = async () => {
    try {
      if (role==='driver'){
        const response = await getMyTrips(["CREATED", "CLOSED"]);
        if(response.state === 'OK') {
          setDriverTrips(response.data?.trips ?? [])
        }
      }
    } catch (error) {
      console.error('Error al obtener viajes:', error);
    }
  }

  useEffect(() => {
    fetchTrips();
  }, [role])
  

  return(
    <div className="w-full">
      <TripHistoryHeader
        role={role}
        onChangeRole={handleChangeRole}
      />

      {role === 'driver' && (
        <TripDriverList
        trips={driverTrips}
        onError={(message) =>
          setToast({ message, type: 'error' })
        }
        onSuccess={(message) =>
          setToast({ message, type: 'success' })
        }
        />
      )}

    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => {
          setToast(null);
          fetchTrips(); 
        }}
      />
    )}
    </div>
  );
}