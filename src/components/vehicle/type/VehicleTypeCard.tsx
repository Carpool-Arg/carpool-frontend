import Image from "next/image";
import { IoCarSport } from "react-icons/io5";

interface VehicleTypeCardProps {
  vehicleType: VehicleType;
  selected: boolean;
  onSelect: (id: number) => void;
}

export function VehicleTypeCard({ vehicleType, selected, onSelect }: VehicleTypeCardProps) {
  return (
    <div
      onClick={() => onSelect(vehicleType.id)}
      className={`flex items-center justify-between border rounded-lg p-4 shadow cursor-pointer transition-all
        ${selected ? "border-primary shadow-md" : "border-gray-1 hover:shadow-md hover:dark:bg-gray-2"}`}
    >
      <div className="flex items-center gap-4">
        
        <span className="text-4xl">
          <IoCarSport/>
        </span>
        
        <div className="">
          <p className="font-medium leading-none">{vehicleType.name}</p>
          <p className="font-light font-inter text-xs text-gray-1/75">{vehicleType.description}</p>
        </div>
      </div>
    </div>
  );
}
