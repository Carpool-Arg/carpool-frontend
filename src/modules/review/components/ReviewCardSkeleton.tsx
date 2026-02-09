export function ReviewCardSkeleton() {
  return (
    <div className="mb-4 px-4 pb-4 pt-2.5 border border-gray-2 rounded-lg shadow-sm animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* número */}
          <div className="h-4 w-6 rounded bg-gray-300 dark:bg-gray-700" />

          {/* estrellas */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-sm bg-gray-300 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>

        {/* fecha */}
        <div className="h-3 w-20 rounded bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* descripción */}
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-3 w-11/12 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-3 w-9/12 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}
