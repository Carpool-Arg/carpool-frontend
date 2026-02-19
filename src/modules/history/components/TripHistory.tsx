'use client'

import { Toast } from "@/components/ux/Toast";
import { TripDriverDTO } from "@/modules/driver-trips/types/tripDriver";
import { getHistoryTripUser, getMyTrips } from "@/services/trip/tripService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TripHistoryUserDTO } from "../types/TripHistoryUserDTO";
import { TripDriverList } from "./driver/TripDriverList";
import TripHistoryHeader from "./TripHistoryHeader";
import { TripPassengerList } from "./passenger/TripPassengerList";

export default function TripHistory() { 
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const role = searchParams.get("role") ?? "passenger";

  const [driverTrips, setDriverTrips] = useState<TripDriverDTO[]>([]);
  const [passengerTrips, setPassengerTrips]=useState<TripHistoryUserDTO[]>([])

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
        }else{
          setToast({ message: response.messages[0] ?? 'No se han podido recuperar los viajes del chofer.', type: 'error' })
          setDriverTrips([])
        }
      }
      if(role==='passenger'){
        const response = await getHistoryTripUser(0,["CREATED", "CLOSED", "FINISHED"]);
        if(response.state === 'OK'){
          setPassengerTrips(response.data?.trips ?? [])
        }else{
          setToast({ message: response.messages[0] ?? 'No se han podido recuperar los viajes del pasajero.', type: 'error' })
          setPassengerTrips([])
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      setToast({ message, type: 'error' })
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
      {role === 'passenger' && (
        <TripPassengerList
        trips={passengerTrips}
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