'use client'

import { useParams } from "next/navigation";
import { useTripDetails } from "../hooks/useTripData";

export function UpdateTripForm(){
  const { id } = useParams();
  const { trip, loading, error, refetch } = useTripDetails(Number(id));
  console.log(trip)
  return(
    <div>
      
    </div>
  );
}