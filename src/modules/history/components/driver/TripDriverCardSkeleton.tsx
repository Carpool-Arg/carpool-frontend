"use client";

export function TripDriverCardSkeleton() {
  return (
    <div className="trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm animate-pulse">
      
      {/* Ruta */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-2 rounded" />
          <div className="h-4 w-4 bg-gray-2 rounded-full" />
          <div className="h-4 w-24 bg-gray-2 rounded" />
        </div>
        <div className="h-5 w-14 bg-gray-2 rounded" />
      </div>

      {/* Fecha + Estado */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-40 bg-gray-2 rounded-xl" />
        <div className="h-5 w-24 bg-gray-2 rounded-xl" />
      </div>

      {/* Info secundaria */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Imagen vehículo */}
          <div className="w-10 h-10 bg-gray-2 rounded" />

          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-gray-2 rounded" />
            <div className="h-3 w-20 bg-gray-2 rounded" />
          </div>
        </div>

        {/* Botón menú */}
        <div className="h-8 w-8 bg-gray-2 rounded-full" />
      </div>
    </div>
  );
}