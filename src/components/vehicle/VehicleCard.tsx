"use client";
import Image from "next/image";
import { useState } from "react";
import { VehicleActionsModal } from "./VehicleActionsModal";

interface VehicleCardProps {
  vehicle: Vehicle;
  onDeleteSuccess: (id: number) => void;
}

export function VehicleCard({ vehicle, onDeleteSuccess }: VehicleCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-between border border-blue-500 rounded-lg p-4 shadow hover:shadow-md transition-all bg-white cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <Image
              src="/car-placeholder.webp"
              alt="Imagen del vehículo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-medium text-gray-900">
            {vehicle.brand} {vehicle.model}
          </span>
        </div>
        <span className="text-blue-500 text-xl">&rsaquo;</span>
      </div>

      <VehicleActionsModal
        vehicle={vehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeleteSuccess={onDeleteSuccess}  // Pasamos el callback para que el modal avise
      />
    </>
  );
}
