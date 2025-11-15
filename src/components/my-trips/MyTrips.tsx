'use client'
import { useEffect, useState } from "react";
import TripSkeleton from "../feed/TripSkeleton";
import { getMyTrips } from "@/services/tripService";
import { TripDriverResponseDTO } from "@/types/response/tripDriverResponseDTO";
import MyTripsList from "./MyTripsList";

export default function MyTrips() {
    const [loading, setLoading] = useState(true); 
    const [myTrips, setMyTrips] = useState<TripDriverResponseDTO | null>(null); 
    useEffect(() => {
        const fetchMyTrips = async () => {
            try{
                const responseMyTrips = await getMyTrips();
                if(responseMyTrips.state === "OK" && responseMyTrips.data){
                    setMyTrips(responseMyTrips.data);
                }
            }catch(error){
                console.error("Error cargando tus viajes:", error);
            }finally{
                setLoading(false);
            }
        };
        fetchMyTrips();
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
    
    return (
        <div className="w-full">
            <MyTripsList myTrips={myTrips!}/>
        </div>
    );
}