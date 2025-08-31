"use client";

import { X, Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Separator from "../ui/Separator";
import { useRouter } from "next/navigation";
import { deleteVehicle } from "@/services/vehicleService";
import { IoCarSport } from "react-icons/io5";

interface Props {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: (id: number) => void;  // Nuevo prop para avisar el borrado exitoso
}

export function VehicleActionsModal({ vehicle, isOpen, onClose, onDeleteSuccess }: Props) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/vehicle/edit/${vehicle.id}`)
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteVehicle(vehicle.id);
      if (!response.success) {
        setError(response.message || "Error al eliminar el vehículo");
        return;
      }
      onDeleteSuccess(vehicle.id);  // Avisar al padre que borró bien
      onClose(); // cerrar modal
    } catch {
      setError("Error al eliminar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-90  flex items-end justify-center h-screen">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isOpen ? "opacity-30" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-md rounded-t-2xl bg-white dark:bg-dark-2 p-6 z-50 shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="mb-4 flex items-center justify-center">
          <button 
          onClick={onClose} 
          className="h-1.5 w-12 rounded-full bg-gray-3 dark:bg-dark-4 "/>
        </div>
        


        <div className="flex items-center gap-4 mb-4">
          <Image src={`/${vehicle.vehicleTypeName}.png`} alt="Car logo" width={56} height={56}/>
          <h1 className="text-lg font-semibold">
            {vehicle.brand?.toUpperCase()} <span className="font-light">{vehicle.model?.toUpperCase()}</span>
          </h1>
        </div>

        <Separator color="bg-gray-2"/>
        <div className="grid grid-cols-2">
          <div className="font-medium">
            <p className="">
              Dominio: <span className="font-inter font-light text-sm"> {vehicle.domain} </span> 
            </p>
            <p>
              Tipo vehículo: <span className="font-inter font-light text-sm">{vehicle.vehicleTypeName}</span>
            </p>
          </div>
          <div className="font-medium">
            <p>
              Año: <span className="font-inter font-light text-sm ">{vehicle.year}</span>
            </p>
            
            <p>
              Color: <span className="font-inter font-light text-sm">{vehicle.color}</span>
            </p>
          </div>
          
        </div>
        <Separator color="bg-gray-2"/>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          onClick={handleEdit}
          className="flex items-center gap-2 mb-4 text-gray-2 hover:text-gray-5 dark:text-gray-1 dark:hover:text-gray-1/75 cursor-pointer"
          disabled={loading}
        >
          <Pencil size={18} />
          Editar vehículo
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-error hover:text-red-800 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Eliminando..." : <><X size={18} />Dar de baja el automóvil</>}
        </button>
      </div>
    </div>
  );
}
