"use client"
import { VehicleForm } from "@/components/vehicle/VehicleForm";
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

    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!vehicle) return <p>No se encontró el vehículo.</p>;

    // Pasarlos al form

    return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Imagen con eslogan (solo en mobile) */}
        <div className="flex justify-start md:hidden w-full pl-4">
        <img
            src="/isologo-dark.webp"
            alt="Logo claro"
            className="block dark:hidden w-[100px] h-[100px] object-contain"
        />
        <img
            src="/isologo.webp"
            alt="Logo oscuro"
            className="hidden dark:block w-[100px] h-[100px] object-contain"
        />
        </div>

        {/* Contenedor del formulario */}
        <div className="w-full max-w-lg">
            <VehicleForm initialData={vehicle} />
        </div>
    </div>
    );
}