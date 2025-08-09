"use client";
import { useEffect, useState } from "react";
import { VehicleTypeCard } from "./VehicleTypeCard";
import { getVehicleTypes } from "@/services/vehicleTypeService";

interface VehicleTypeListProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function VehicleTypeList({ selectedId, onSelect }: VehicleTypeListProps) {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleType = async () => {
      const result = await getVehicleTypes();

      if (result.success && result.data) {
        setVehicleTypes(result.data.data);
      } else {
        setError(result.message || "Error al obtener los tipos de vehículos");
      }
      setLoading(false);
    };

    fetchVehicleType();
  }, []);

  if (loading) return <p>Cargando tipos de vehículos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (vehicleTypes.length === 0) return <p>No hay tipos de vehículos registrados.</p>;

  return (
    <div className="space-y-4">
      {vehicleTypes.map((vehicleType) => (
        <VehicleTypeCard
          key={vehicleType.id}
          vehicleType={vehicleType}
          selected={selectedId === vehicleType.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}