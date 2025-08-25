import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface RoleOptionsProps {
  role: 'driver' | 'passenger';
  logout: () => void;
}

export function RoleOptions({ role, logout }: RoleOptionsProps) {
  const isDriver = role === 'driver';

  const linkClasses = `
    flex items-center justify-between gap-2 px-4 py-3
    rounded-lg transition-colors duration-200
    hover:bg-gray-1 dark:hover:bg-gray-2
    text-sm font-medium text-gray-700 dark:text-gray-200
  `;

  return (
    <div className="flex flex-col gap-1 p-2 bg-white dark:bg-gray-2/50 rounded-xl shadow-md">
      <Link href="/profile/details" className={linkClasses}>
        <span>Perfil</span>
        <ChevronRight size={18} />
      </Link>

      {isDriver && (
        <Link href="/vehiculos" className={linkClasses}>
          <span>Vehículos</span>
          <ChevronRight size={18} />
        </Link>
      )}

      <Link
        href={`/trips/${isDriver ? 'driver' : 'passenger'}`}
        className={linkClasses}
      >
        <span>Historial de viajes</span>
        <ChevronRight size={18} />
      </Link>

      <button
        onClick={logout}
        className={`
          ${linkClasses}
          text-red-500 hover:bg-red-100 dark:hover:bg-red-950 cursor-pointer
        `}
        type="button"
      >
        <span>Cerrar sesión</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
