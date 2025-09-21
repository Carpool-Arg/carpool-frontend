import { useUserVehicles } from "@/hooks/useUserVehicles";
import { VehicleCard } from "../vehicle/VehicleCard";
import { VehicleCardSkeleton } from "../vehicle/VehicleSkeleton";


export function VehicleSelector({ 
  selectedVehicle, 
  onSelect 
}: { 
  selectedVehicle?: Vehicle, 
  onSelect: (v: Vehicle) => void 
}) {
  const { vehicles, loading, error } = useUserVehicles();

  if (loading) return <VehicleCardSkeleton/>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-2">
      {vehicles.map(v => (
        <div 
          key={v.id} 
          className={`rounded-lg transition-all ${
            selectedVehicle?.id === v.id 
              ? "ring-2 ring-blue-500" 
              : ""
          }`}
        >
          <VehicleCard 
            vehicle={v} 
            onClick={() => onSelect(v)} 
          />
        </div>
      ))}
    </div>
  );
}
