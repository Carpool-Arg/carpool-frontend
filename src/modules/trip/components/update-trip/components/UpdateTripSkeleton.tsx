const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`bg-gray-2 animate-pulse rounded ${className}`} />
);

const UpdateTripFormSkeleton = () => {
  return (
    <div className="space-y-4 w-full md:mt-4">

      {/* Vehicle Card */}
      <div className="flex items-center justify-between p-4 bg-gray-7 rounded-lg">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="w-12 h-12 rounded-lg" />
          <div className="space-y-2">
            <SkeletonBlock className="w-32 h-4" />
            <SkeletonBlock className="w-20 h-3" />
          </div>
        </div>
        <SkeletonBlock className="w-8 h-8 rounded-full" />
      </div>

      {/* Origin */}
      <div className="space-y-2">
        <SkeletonBlock className="w-24 h-3" />
        <SkeletonBlock className="w-full h-10 rounded-lg" />
        <SkeletonBlock className="w-full h-8 rounded-lg" />
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <SkeletonBlock className="w-24 h-3" />
        <SkeletonBlock className="w-full h-10 rounded-lg" />
        <SkeletonBlock className="w-full h-8 rounded-lg" />
      </div>

      {/* Button */}
      <SkeletonBlock className="w-56 h-8 rounded-lg" />

      {/* Baggage */}
      <div className="space-y-2">
        <SkeletonBlock className="w-24 h-3" />
        <div className="flex gap-4">
          <SkeletonBlock className="w-20 h-20 rounded-2xl" />
          <SkeletonBlock className="w-20 h-20 rounded-2xl" />
          <SkeletonBlock className="w-20 h-20 rounded-2xl" />
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <SkeletonBlock className="w-40 h-3" />
        <SkeletonBlock className="w-full h-10 rounded-lg" />
      </div>

      {/* Seats & Price */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <SkeletonBlock className="w-32 h-3" />
          <SkeletonBlock className="w-full h-10 rounded-lg" />
        </div>
        <div className="space-y-2">
          <SkeletonBlock className="w-32 h-3" />
          <SkeletonBlock className="w-full h-10 rounded-lg" />
        </div>
      </div>

      {/* Summary */}
      <SkeletonBlock className="w-full h-24 rounded-lg" />

      {/* Button */}
      <div className="flex justify-center">
        <SkeletonBlock className="w-40 h-10 rounded-lg" />
      </div>
    </div>
  );
};

export default UpdateTripFormSkeleton;