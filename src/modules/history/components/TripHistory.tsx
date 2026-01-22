'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TripHistoryHeader from "./TripHistoryHeader";
import { useEffect, useState } from "react";
import { TripDriverResponseDTO } from "@/modules/driver-trips/types/dto/tripDriverResponseDTO";
import { getMyTrips } from "@/services/trip/tripService";
import { TripDriverList } from "./driver/TripDriverList";
import { TripDriverDTO } from "@/modules/driver-trips/types/tripDriver";

export default function TripHistory() { 
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const role = searchParams.get("role") ?? "passenger";

  const [driverTrips, setDriverTrips] = useState<TripDriverDTO[]>([]);

  const handleChangeRole = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", value);
    // Resetear equipaje al cambiar de tab si quisieras (opcional), sino lo dejas
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (role==='driver'){
          const response = await getMyTrips();
          if(response.state === 'OK') {
            setDriverTrips(response.data?.trips ?? [])
          }
        }
      } catch (error) {
        console.error('Error al obtener viajes:', error);
      }
    }
    fetchTrips();
  }, [role])
  
  

  return(
    <div className="w-full">
      <TripHistoryHeader
        role={role}
        onChangeRole={handleChangeRole}
      />

      {role === 'driver' && (
        <TripDriverList trips={driverTrips} />
      )}
    </div>
  );
}