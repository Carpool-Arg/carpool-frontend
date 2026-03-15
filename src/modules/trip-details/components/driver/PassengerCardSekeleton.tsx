export default function PassengerCardSkeleton() {
  return (
    <div className="p-4 rounded-xl shadow-sm bg-gray-8 w-full animate-pulse">
      <div className="flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-2"></div>

          <div className="flex flex-col gap-1">
            {/* Nombre */}
            <div className="h-3 w-28 bg-gray-2 rounded"></div>

            {/* Rol */}
            <div className="h-2 w-16 bg-gray-2 rounded"></div>
          </div>

        </div>

        {/* Botón skeleton */}
        <div className="h-7 w-28 bg-gray-2 rounded-lg"></div>

      </div>
    </div>
  );
}