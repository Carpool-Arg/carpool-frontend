'use client'

import { getReservations } from "@/services/reservationService";
import { ReservationResponseDTO } from "@/types/response/reservationResponseDTO";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TripSkeleton from "../feed/TripSkeleton";

export default function TripReservations() {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [TripReservations, setTripReservations] = useState<ReservationResponseDTO | null>(null); 
  const { id } = useParams();

  useEffect(() => {
    const fetchTripReservations = async () => {
      try{
        if(!id) return
        setLoading(true);
        const responseTripReservations = await getReservations({
          idTrip: Number(id),
          idDestinationCity: null,
          idStartCity: null,
          baggage: null,
          nameState: null 
        })

        if(responseTripReservations.state == "ERROR"){
          setError(responseTripReservations.messages[0]);
        }

        if(responseTripReservations.state == "OK" && responseTripReservations.data){
          setTripReservations(responseTripReservations.data);
        }
      }catch(error){
        console.error("Error cargando las reservaciones del viaje:", error);
      }finally{
        setLoading(false);
      }
    }
    fetchTripReservations()
  },[]);

  if (loading) {
      return (
        <div className="w-full">
          {Array.from({ length: 2 }).map((_, i) => (
            <TripSkeleton key={i} />
          ))}
        </div>
      );
  }
  
  return <div className="w-full">
    
  </div>
}