import Image from "next/image";

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
        ${selected ? "border-blue-600 bg-blue-200 shadow-md" : "border-blue-300 bg-white hover:shadow-md hover:bg-blue-50"}`}
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
        <span className="font-medium text-gray-900">{vehicleType.name}</span>
      </div>
    </div>
  );
}
