export function DriverProfileDetailsSkeleton() {
  return (
    <div className="max-w-lg animate-pulse">
      <div className="rounded-xl border border-gray-7 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-8">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-32 bg-gray-2 rounded" />
            <div className="h-3 w-24 bg-gray-2 rounded" />
          </div>
        </div>



        <div className="p-5 w-full">

          {/* Avatar + name */}
          <div className="flex items-center mb-5 w-full gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-2" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-40 bg-gray-2 rounded" />
              <div className="h-3 w-24 bg-gray-2 rounded" />
            </div>
          </div>

          {/* Grid 1 */}
          <div className="border-t border-gray-7 pt-4 grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-20 bg-gray-2 rounded" />
                <div className="h-4 w-full bg-gray-2 rounded" />
              </div>
            ))}
          </div>

          {/* Grid 2 */}
          <div className="border-t border-gray-7 mt-3 pt-4">
            <div className="flex flex-col gap-2">
              <div className="h-3 w-40 bg-gray-2 rounded" />
              <div className="h-4 w-32 bg-gray-2 rounded" />
            </div>
          </div>

          {/* Images */}
          <div className="border-t border-gray-7 mt-4 pt-4 flex gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 bg-gray-2/25 rounded-lg px-3 py-3"
              >
                <div className="h-3 w-16 bg-gray-2 rounded mb-2" />
                <div className="h-4 w-24 bg-gray-2 rounded" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}