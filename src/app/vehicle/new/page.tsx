'use client'; 
import { VehicleForm } from "@/components/vehicle/VehicleForm";

export default function VehicleNewPage(){
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-md">
        <VehicleForm />
      </div>
    </div>
  );
}