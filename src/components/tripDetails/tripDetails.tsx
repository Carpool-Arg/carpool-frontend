'use client'

import { TripDetailsData } from "@/types/response/trip";
import { useEffect, useState } from "react";
import { getTripDetails } from "@/services/tripService";
import dayjs from "dayjs"
import Separator from "../ui/Separator";
import { baggageOptions } from "../trip/TripFrom";
import { useAuth } from "@/contexts/authContext";
import { TripRoutePreview } from "../trip/TripRoutePreview";
import { TripStop } from "@/types/tripStop";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";
import { capitalizeWords } from "@/utils/string";
import { Button } from "../ui/Button";

type TripDetailsProps = {
    tripId: number;
}

export default function TripDetails({
    tripId
}:TripDetailsProps){
    const [trip, setTrip] = useState<TripDetailsData | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string |null>(null);
    const { user, prevImage } = useAuth();

    useEffect(() => {
        const loadTrip = async () =>{
            try{
                setLoading(true)
                const res = await getTripDetails(tripId);
                if(res.state === 'ERROR'){
                    setError(res.messages[0])
                    throw new Error(`Error ${res.messages[0]}`)
                }
                setTrip(res.data);
            }catch(err:any){
                setError(err.message);
                console.error(err)
            }finally{
                setLoading(false);
            }
        }

        loadTrip()
    }, [tripId])

    const selectedBaggage = baggageOptions.find(
        (b) => b.value === trip?.availableBaggage
    );

    const BaggageIcon = selectedBaggage?.icon;
    const imageToShow = prevImage || user?.profileImage;

    if (loading) return <p>Cargando viaje...</p>
    if (error) return <p>Error: {error}</p>
    if (!trip) return <p>No se encontró el viaje.</p>

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto h-screen">
            <div className="w-full">
                <h2 className="text-2xl font-semibold text-center">Detalles del viaje</h2>
                <Separator color="bg-gray-6 dark:bg-gray-2"/>
            </div>

            <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(9, 1fr)",
                gridTemplateRows: "repeat(11, 1fr)",
                gap: "8px",
            }}
            className="w-full h-full mt-4"
            >
                <div style={{ gridColumn: "1 / span 5", gridRow: "1 / span 2" }} className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl">
                    
                    <h2 className="text-gray-7 mt-3 ml-3 dark:text-gray-1 font-medium text-xl">
                    Disponibilidad
                    </h2>
                    <div className="flex-grow flex items-center justify-center">
                        <span className="font-medium text-4xl">
                        {trip.availableSeat}/{trip.availableSeat}
                        </span>
                    </div> 
                    {/* Ver porque me hace falta la cantidad de asientos inicial del viaje */}
                </div>

                <div style={{ gridColumn: "6 / span 4", gridRow: "1 / span 2" }} className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl">
                    
                    <h2 className="text-gray-7 mt-3 ml-3 dark:text-gray-1 font-medium text-xl">
                    Precio
                    </h2>
                    <div className="flex-grow flex items-center justify-center">
                        <span className="font-medium text-4xl">
                            ${trip.seatPrice}
                        </span>
                    </div>
                </div>



                <div 
                style={{ gridColumn: "1 / span 9", gridRow: "3 / span 4" }} className="bg-gray-6 dark:bg-gray-8 rounded-xl flex flex-col">
                    <h2 className="text-gray-7 mt-3 ml-3 dark:text-gray-1 font-medium text-xl">
                        Recorrido
                    </h2>
                    <div className="ml-3 mt-2 items-center">
                        <TripRoutePreview
                        tripStops={trip.tripStops.sort((a,b)=>a.order - b.order)} //Esto es para asegurarme que se pase en orden
                        />
                    </div>
                </div>

                <div 
                style={{ gridColumn: "1 / span 9", gridRow: "7 / span 2" }} className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl">
                    
                    
                    <h2 className="text-gray-7 mt-3 ml-3 dark:text-gray-1 font-medium text-xl mb-2">
                        Datos del conductor
                    </h2>
                    <div className="flex gap-5 items-center">
                        <img
                        src="/Sin título.png"
                        alt="Foto de perfil"
                        className="w-15 h-15 rounded-full object-cover ml-3"
                        />
                        <div className="text-gray-7 dark:text-gray-1 flex flex-col">
                            <span className="font-medium">{trip.driverName}</span>
                            <div className="flex items-center gap-2">
                                {/* Aca hay que poner la calificacion del chofer */}
                                <span className="font-medium pt-1.5">4.5</span>
                                <Rating
                                initialValue={4.5} 
                                fillColor="#ffffff"  
                                emptyColor="#706562"
                                size={18}
                                readonly           
                                SVGstyle={{'display': 'inline'}}
                                allowFraction    
                                />
                            </div>
                        </div>

                    </div>

                </div>

                <div 
                style={{ gridColumn: "1 / span 6", gridRow: "9 / span 2" }} className="bg-gray-6 dark:bg-gray-8 flex flex-col rounded-xl">
                    <h2 className="text-gray-7 mt-3 ml-3 dark:text-gray-1 font-medium text-xl mb-2">
                        Datos del vehiculo
                    </h2>
                    <div className="flex items-center gap-2">
                        <Image
                        src={`/${trip.vehicle.vehicleTypeName}.png`}
                        alt="Car logo"
                        width={75}
                        height={75}
                        className="ml-3"
                        />
                        <div className="flex flex-col">
                            <span >{capitalizeWords(trip.vehicle.brand)} {capitalizeWords(trip.vehicle.model)}</span>
                            <span>{trip.vehicle.domain}</span>
                            <span>Color: {capitalizeWords(trip.vehicle.color)}</span>
                        </div>
                    </div>

                </div>

                <div 
                style={{ gridColumn: "7 / span 3", gridRow: "9 / span 2" }} className="bg-gray-6 dark:bg-gray-8 flex flex-col items-center rounded-xl">
                    <h2 className="text-gray-7 mt-3 dark:text-gray-1 font-medium text-xl mb-2">
                        Equipaje
                    </h2>
                    <div className="flex flex-col items-center text-gray-7 dark:text-gray-1">
                        <div className="flex items-center gap-2">
                            {BaggageIcon && (
                                <div className="p-2 rounded-lg">
                                <BaggageIcon className="w-10 h-10" />
                                </div>
                            )}
                        </div>
                        <span className="font-medium text-xl">{selectedBaggage?.type}</span>
                    </div>
                </div>



                <div
                    style={{ gridColumn: "1 / span 9", gridRow: "11 / span 1" }}
                    className="flex justify-center items-center"
                >
                    <Button
                    type="button"
                    variant="primary"
                    className='px-12 py-2 text-sm font-inter font-medium'
                    >
                        Reservar
                    </Button>
                </div>
            </div>

        </div>
    )
}