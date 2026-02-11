export function TripPriceSummarySkeleton() {
  return (
    <div className="rounded-lg border border-gray-5/40 dark:border-gray-2/40 bg-gray-1/30 dark:bg-gray-2/10 p-4">
      {/* Título */}
      <div className="h-4 w-32 mb-4 rounded bg-gray-2 animate-pulse" />

      <div className="space-y-3">
        {/* Fila 1 */}
        <div className="flex justify-between items-center">
          <div className="h-3 w-32 rounded bg-gray-2 animate-pulse" />
          <div className="h-4 w-20 rounded bg-gray-2 animate-pulse" />
        </div>

        {/* Fila 2 */}
        <div className="flex justify-between items-center">
          <div className="h-3 w-40 rounded bg-gray-2 animate-pulse" />
          <div className="h-4 w-16 rounded bg-gray-2 animate-pulse" />
        </div>

        {/* Fila 3 */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-5/30">
          <div className="h-3 w-48 rounded bg-gray-2 animate-pulse" />
          <div className="h-4 w-24 rounded bg-gray-2 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
