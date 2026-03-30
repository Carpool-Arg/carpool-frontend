export function UserReviewCardSkeleton() {
  return (
    <div className="trip-card mb-4 px-4 pb-4 pt-2.5 border border-gray-2 rounded-lg shadow-sm animate-pulse">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* número de estrellas */}
          <div className="h-4 w-6 rounded bg-gray-2" />

          {/* estrellas */}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded bg-gray-2"
              />
            ))}
          </div>
        </div>

        {/* fecha */}
        <div className="h-3 w-24 rounded bg-gray-2" />
      </div>

      {/* descripción */}
      <div className="mb-4 mt-2 px-2 space-y-2">
        <div className="h-3 w-full rounded bg-gray-2" />
        <div className="h-3 w-10/12 rounded bg-gray-2" />
        <div className="h-3 w-8/12 rounded bg-gray-2" />
      </div>

      {/* usuario */}
      <div className="flex items-center gap-2">
        {/* avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-2 border" />

        <div className="flex flex-col gap-1">
          {/* nombre */}
          <div className="h-3 w-28 rounded bg-gray-2" />

          {/* texto del viaje */}
          <div className="h-3 w-40 rounded bg-gray-2" />
        </div>
      </div>

    </div>
  );
}