export default function TripReservationsSkeleton() {
  return (
    <div className="mb-4 animate-pulse">
      {/* Título */}
      <div className="h-6 w-64 bg-gray-2 rounded-md mb-3" />

      {/* Ruta */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-6 w-24 bg-gray-2 rounded-full" />
        <div className="h-4 w-4 bg-gray-2 rounded-full" />
        <div className="h-6 w-24 bg-gray-2 rounded-full" />
      </div>

      {/* Texto */}
      <div className="h-5 w-72 bg-gray-2 rounded-md mb-4" />

      {/* Filtros */}
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-5 w-1/4 bg-gray-2 rounded-lg" />
        <div className="h-5 w-1/6 bg-gray-2 rounded-lg" />
        <div className="h-5 w-1/6 bg-gray-2 rounded-lg" />
      </div>
    </div>
  );
};
