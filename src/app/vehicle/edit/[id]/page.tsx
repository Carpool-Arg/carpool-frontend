"use client"

import { VehicleUpdateForm } from "@/components/vehicle/VehicleUpdateForm";
import { getVehicleById } from "@/services/vehicleService";
import { VehicleResponse } from "@/types/response/vehicle";
import { Vehicle } from "@/types/vehicle";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation"; 
import { useEffect, useState } from "react";

export default function VehicleEditPage(){
    //Capturar el id
    const { id } = useParams(); // obtienes el id directamente

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return; // Aún no está disponible

        const fetchVehicle = async () => {
            try {
                const response: VehicleResponse = await getVehicleById(Number(id));
                if (response.state === "ERROR" || !response.data) {
                    setError(response.messages?.[0] || "Error al obtener los datos del vehículo");
                    return;
                }
                setVehicle(response.data);
            } catch {
                setError("Error al obtener los datos del vehículo");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

     if (loading) {
        return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="animate-spin w-8 h-8 text-gray-500 mb-2" />
            <p className="text-gray-500">Cargando información del vehículo...</p>
        </div>
        );
    }
   
    return (
    <div className="min-h-screen flex flex-col items-center md:py-8">
        <div className="w-full max-w-lg">
            {vehicle && <VehicleUpdateForm vehicle={vehicle} />}
        </div>
        {error && <p className="text-gray-600">{error}</p>}
    </div>
    );
}