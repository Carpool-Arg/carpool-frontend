export function CurrentTripSkeleton() {
  return (
    <div className="relative flex flex-col h-full animate-pulse">
      <div className="relative z-10 flex flex-col justify-between h-full p-4">
        <div />

        <div className="flex flex-col gap-2">
          {/* Card: Modo conductor */}
          <div className="bg-gray-8/90 rounded-xl p-6 flex flex-col">
            <div className="h-6 w-10 bg-gray-7 rounded" />

            <div className="h-7 w-2/3 bg-gray-7 rounded my-4" />

            <div className="h-16 w-full bg-gray-7 rounded-lg" />
          </div>

          {/* Card: Trip info */}
          <div className="bg-gray-8/90 backdrop-blur rounded-xl p-6 space-y-4">
            {/* Header */}
            <div className="space-y-2">
              <div className="h-7 w-1/2 bg-gray-7 rounded" />

              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-gray-7 rounded" />
                <div className="h-4 w-4 bg-gray-7 rounded-full" />
                <div className="h-4 w-20 bg-gray-7 rounded" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-7 rounded-full" />

            {/* Current stop */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-7 rounded-lg" />
              <div className="h-4 w-40 bg-gray-7 rounded" />
            </div>

            {/* Trip details */}
            <div className="space-y-2 bg-gray-7 p-3 rounded-lg">
              <div className="h-5 w-3/4 bg-gray-2 rounded" />
              <div className="h-4 w-1/2 bg-gray-2 rounded" />
              <div className="h-4 w-2/3 bg-gray-2 rounded" />
            </div>

            {/* Action */}
            <div className="flex items-center justify-end pt-2">
              <div className="h-10 w-40 bg-gray-7 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
