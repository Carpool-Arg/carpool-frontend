export function NewDriverReviewSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Estrellas */}
      <div className="flex gap-2 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-8 rounded-full bg-gray-2"
          />
        ))}
      </div>

      {/* Texto de rating */}
      <div className="h-5 w-40 rounded bg-gray-2 self-center" />

      {/* Textarea */}
      <div className="h-24 w-full rounded-xl bg-gray-2" />

      {/* Botón */}
      <div className="h-10 w-full rounded-xl bg-gray-2" />
    </div>
  );
}
