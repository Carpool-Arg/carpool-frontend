"use client";
import { myVehicles } from "@/services/vehicleService";
import { useEffect, useState } from "react";
import { VehicleCard } from "./VehicleCard";

export function VehicleList(){
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      const result = await myVehicles();

      if (result.success && result.data) {
        setVehicles(result.data.data); // adaptá si el key no es `vehicles`
      } else {
        setError(result.message || "Error al obtener vehículos");
      }
      setLoading(false);
    };

    fetchVehicle();
  }, []);

  if (loading) return <p>Cargando vehículos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (vehicles.length === 0) return <p>No tenés vehículos registrados.</p>;
  return (
    <div className="space-y-4">
      {vehicles.map((vehicle, index) => (
        <VehicleCard key={index} vehicle={vehicle} />
      ))}
    </div>
  );
}

//componente -> myVehicle (service) -> API (NEXT)