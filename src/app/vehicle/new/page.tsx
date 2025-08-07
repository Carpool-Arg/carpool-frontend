'use client'; 
import { VehicleForm } from "@/components/vehicle/VehicleForm";

export default function VehicleNewPage(){
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
        <VehicleForm />
      </div>
    </div>
  );
}