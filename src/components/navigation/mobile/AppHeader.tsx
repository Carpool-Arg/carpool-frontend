'use client'

import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AppHeaderProps {
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const AppHeader = ({ showBack, rightAction }: AppHeaderProps) => {
  const pathname = usePathname();

  // Mapa de rutas a títulos
  const routeTitles: Record<string, string> = {
    '/profile/details': 'Perfil',
    '/settings': 'Configuración',
    '/home': 'Inicio',
    '/search': 'Buscar',
    '/notifications': 'Notificaciones',
    '/register-driver': 'Registrar conductor',
  };

  // Buscar título exacto o por prefijo
  const title =
    routeTitles[pathname] ??
    Object.entries(routeTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    'App';

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-dark-5 border-b border-gray-2 dark:border-gray-2">
      {showBack ? (
        <button onClick={() => history.back()} className="text-gray-700 dark:text-gray-200 cursor-pointer">
          <ChevronLeft size={18}/>
        </button>
      ) : (
        <div className="w-6" /> // espacio para alinear
      )}

      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>

      <div>{rightAction}</div>
    </div>
  );
};
