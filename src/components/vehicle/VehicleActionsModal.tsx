"use client";

import { X, Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Separator from "../ui/Separator";
import { useRouter } from "next/navigation";
import { deleteVehicle } from "@/services/vehicleService";

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
    <div className="fixed inset-0 z-90 flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isOpen ? "opacity-30" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-md bg-white rounded-t-2xl p-6 z-50 shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />

        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-12 h-12">
            <Image src="/car-placeholder.webp" alt="Auto" fill className="object-contain" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {vehicle.brand?.toUpperCase()} {vehicle.model?.toUpperCase()}
          </h2>
        </div>
        
        <Separator/>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          onClick={handleEdit}
          className="flex items-center gap-2 mb-4 text-gray-800 hover:text-blue-600 cursor-pointer"
          disabled={loading}
        >
          <Pencil size={18} />
          Editar vehículo
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Eliminando..." : <><X size={18} />Dar de baja el automóvil</>}
        </button>
      </div>
    </div>
  );
}
