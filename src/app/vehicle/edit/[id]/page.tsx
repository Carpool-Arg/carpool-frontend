"use client"

import { VehicleUpdateForm } from "@/components/vehicle/VehicleUpdateForm";
import { getMyVehicleById } from "@/services/vehicleService";
import { useParams } from "next/navigation"; 
import { useEffect, useState } from "react";

export default function VehicleEditPage(){
    //Capturar el id
    const { id } = useParams(); // ✅ obtienes el id directamente

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if (!id) return; // Aún no está disponible

    const fetchVehicle = async () => {
        try {
        const response = await getMyVehicleById(Number(id));
        if (!response.success || !response.data) {
            setError(response.message || "Error al obtener los datos del vehículo");
            return;
        }
        setVehicle(response.data.data);
        } catch {
        setError("Error al obtener los datos del vehículo");
        } finally {
        setLoading(false);
        }
    };

    fetchVehicle();
    }, [id]);

    if (error) return <p className="text-red-600">{error}</p>;
    if (!vehicle) return <p>No se encontró el vehículo.</p>;

    // Pasarlos al form
    console.log('vehicle',vehicle)
    return (
    <div className="min-h-screen flex flex-col items-center md:py-8">
        {/* Contenedor del formulario */}
        <div className="w-full max-w-lg">
            <VehicleUpdateForm initialData={vehicle} />
        </div>
    </div>
    );
}