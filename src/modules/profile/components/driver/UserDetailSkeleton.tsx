export function UserDetailsSkeleton() {
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
      </div>
      
    </div>
  );
}