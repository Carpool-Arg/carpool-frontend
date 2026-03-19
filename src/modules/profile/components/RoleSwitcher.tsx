type Role = 'pasajero' | 'conductor';

export function RoleSwithcer({ role, onChange }: { role: Role; onChange: (r: Role) => void }) {
  const activeIndex = role === 'conductor' ? 1 : 0;

  return (
    <div className="bg-gray-8 rounded-full w-2/3 p-1 my-4">
      <div className="relative flex">
        {/* PILL */}
        <div
          className="absolute inset-y-0 w-1/2 rounded-full bg-black
                     transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        <button
          onClick={() => onChange('pasajero')}
          className={`
            relative z-10 w-1/2 px-4 py-1.5 text-sm
            transition-colors duration-300 cursor-pointer
            ${role === 'pasajero' ? "text-white" : "text-gray-11 hover:text-white"}
          `}
        >
          Pasajero
        </button>

        <button
          onClick={() => onChange('conductor')}
          className={`
            relative z-10 w-1/2 px-4 py-1.5 text-sm
            transition-colors duration-300 cursor-pointer
            ${role === 'conductor' ? "text-white" : "text-gray-11 hover:text-white"}
          `}
        >
          Conductor
        </button>
      </div>
    </div>
  );
}