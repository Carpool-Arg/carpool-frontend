"use client";
import Image from "next/image";
import { useState } from "react";
import { VehicleActionsModal } from "./VehicleActionsModal";
import { IoCarSport } from "react-icons/io5";
import { ChevronRight } from "lucide-react";

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
        className="flex items-center justify-between border border-gray-2 dark:border-gray-1 rounded-lg p-4 shadow hover:shadow-md hover:dark:bg-gray-2/75 transition-all cursor-pointer"
      >
        
        <div className="flex items-center gap-4">
          <span className="text-4xl">
            <IoCarSport/>
          </span>
          <div>
            <p className="font-semibold leading-none">
              {vehicle.brand} 
            </p>
            <p className="text-sm font-light leading-none">
              {vehicle.model}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm font-inter text-gray-1/75">
            {vehicle.domain}
          </p>
          <ChevronRight size={18}/>
        </div>
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
