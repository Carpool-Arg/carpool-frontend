export function ProfileDetailsSkeleton() {
  return (
    <div className="space-y-4 max-w-lg animate-pulse">

      {/* Botones de foto */}
      <div className="flex justify-center gap-4">
        <div className="h-9 w-32 bg-gray-7 rounded-md" />
        <div className="h-9 w-32 bg-gray-7 rounded-md" />
      </div>

      {/* Formulario */}
      <div className="space-y-4">

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-20 bg-gray-7 rounded" />
              <div className="h-10 w-full bg-gray-7 rounded-md" />
            </div>
          ))}
        </div>

        {/* DNI + Birthdate */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-24 bg-gray-7 rounded" />
              <div className="h-10 w-full bg-gray-7 rounded-md" />
            </div>
          ))}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-gray-7 rounded" />
          <div className="h-10 w-full bg-gray-7 rounded-md" />
        </div>

        {/* Celular + Género */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Celular */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-20 bg-gray-7 rounded" />
            <div className="h-10 w-full bg-gray-7 rounded-md" />
          </div>

          {/* Género (Select) */}
          <div className="flex flex-col gap-2">
            <div className="h-3 w-20 bg-gray-7 rounded" />
            <div className="h-10 w-full bg-gray-7 rounded-md" />
          </div>

        </div>

        {/* Botón submit */}
        <div className="h-10 w-full bg-gray-7 rounded-lg" />

      </div>
    </div>
  );
}