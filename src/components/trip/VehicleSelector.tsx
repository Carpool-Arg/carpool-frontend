import { useUserVehicles } from "@/hooks/useUserVehicles";

export function VehicleSelector({ selectedVehicle, onSelect }: { selectedVehicle?: Vehicle, onSelect: (v: Vehicle) => void }) {
  const { vehicles, loading, error } = useUserVehicles();

  if (loading) return <p>Cargando vehículos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-2">
      {vehicles.map(v => (
        <div
          key={v.id}
          onClick={() => onSelect(v)}
          className={`p-2 border rounded cursor-pointer ${selectedVehicle?.id === v.id ? 'border-blue-500 bg-blue-100' : 'border-gray-200'}`}
        >
          {v.brand} {v.model} ({v.domain})
        </div>
      ))}
    </div>
  );
}
