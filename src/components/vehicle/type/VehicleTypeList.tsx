"use client";
import { useEffect, useState } from "react";
import { VehicleTypeCard } from "./VehicleTypeCard";
import { getVehicleTypes } from "@/services/vehicleTypeService";
import { VehicleTypeCardSkeleton } from "./VehicleTypeSkeleton";

interface VehicleTypeListProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function VehicleTypeList({ selectedId, onSelect }: VehicleTypeListProps) {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true)
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


  return (
    <div className="space-y-4">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <VehicleTypeCardSkeleton key={idx} />
            ))
          : vehicleTypes.map((vehicleType) => (
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