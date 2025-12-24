'use client';

import { AlertDialog } from '@/components/ux/AlertDialog';
import Separator from '@/components/ux/Separator';
import { R2_PUBLIC_PREFIX } from '@/constants/imagesR2';
import { useAuth } from '@/contexts/authContext';
import { Construction, History, Home, LogOut, LucideIcon, PlusCircle, Search, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export type Role = 'user' | 'driver' | null;

const navItems: { 
  href: string; 
  icon: LucideIcon; 
  label: string; 
  role: Role ;
  disabled?: boolean;
}[] = [
  { href: '/home', icon: Home, label: 'Inicio', role: 'user' },
  { href: '/search', icon: Search, label: 'Buscar', role: 'user' },
  { href: '/trip/new', icon: PlusCircle, label: 'Publicar viaje', role: 'driver' },
  { href: '/history', icon: History, label: 'Historial', role: 'user', disabled: true },
  { href: '/profile', icon: User, label: 'Perfil', role: 'user' },
];


export default function DesktopSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsDialogOpen(false);
  };

  const userRoles = user?.roles || ['user'];
  
  
  // Filtramos los ítems según el rol del usuario
  const filteredNavItems = navItems.filter(item => userRoles.includes(item.role));

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-dark-5 border-r border-gray-200 dark:border-gray-2 flex-col justify-between px-4 py-8 z-50">
      {/* Top section: logo y navegación */}
      <div>
        <Link href={'/profile'} className=" bg-gradient-to-tr from-gray-2 via-75% to-transparent rounded-lg py-1 flex items-center justify-start px-2">
          <Image
            src={`${R2_PUBLIC_PREFIX}/isologo.svg`}
            alt="Imagen de login"
            width={50}
            height={50}
            className="object-contain dark:invert"
            priority
          />
          <span className="font-medium text-gray-6 px-2 flex items-center gap-2">
            {!user?.profileImage ? (
              <span className="w-5 h-5 rounded-full bg-gray-3 dark:bg-gray-2 animate-pulse" />
            ) :  (
              <Image
                src={user?.profileImage ?? ''}
                alt="Foto de perfil"
                width={20}
                height={20}
                className="rounded-full object-cover"
              />
            )}


            <span className="max-w-[120px] truncate">{user?.username}</span>
          </span>
        </Link>
        <Separator color='bg-gray-2' />
        <nav className="flex flex-col gap-2">
          {filteredNavItems.map(({ href, icon: Icon, label, disabled }) => {
            const isActive = pathname.startsWith(href);
            if (disabled) {
            return (
              <div
                key={href}
                className="
                  group flex items-center gap-3 p-2 rounded-md text-sm
                  text-gray-9 cursor-not-allowed
                  transition-colors
                  hover:text-gray-1 hover:dark:bg-gradient-to-r
                  hover:dark:from-gray-8 hover:dark:via-gray-8 hover:dark:to-dark-5
                "
              >
                <Icon size={20} />

                <span className="flex items-center gap-2">
                  {label}

                  <span
                    className="
                      flex items-center gap-1
                      text-[10px] font-medium
                      px-2 py-0.5 rounded-full
                      bg-yellow-100 text-yellow-800
                      dark:bg-yellow-900/30 dark:text-yellow-300
                    "
                  >
                    <Construction size={10} />
                    Próximamente
                  </span>
                </span>
              </div>
            );
          }
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'text-gray-1 font-medium bg-gradient-to-r dark:from-gray-8 dark:via-gray-8 dark:to-dark-5'
                    : 'text-gray-9 hover:text-gray-1 hover:dark:bg-gradient-to-r hover:dark:from-gray-8 hover:dark:via-gray-8 hover:dark:to-dark-5'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Bottom section: usuario y logout */}
      <div className="text-sm flex flex-col gap-1">
        <Separator color='bg-gray-2'/>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="text-red-500 hover:bg-red-100 dark:text-gray-6 dark:hover:text-white dark:hover:bg-red-950 dark:bg-gray-8 dark:to-dark-5 px-4 py-2 font-medium transition-colors text-left rounded-md cursor-pointer flex items-center gap-2"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>

      <AlertDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleLogout}
        type="info"
        title="Cerrar sesión"
        description="¿Estás seguro de que querés cerrar sesión? Tendrás que volver a iniciar sesión para continuar usando la aplicación."
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
      />
    </aside>
  );
}
