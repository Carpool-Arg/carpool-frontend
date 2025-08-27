'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bell, User, Infinity, UserCircle2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/authContext';

const navItems = [
  { href: '/home', icon: Home, label: 'Inicio' },
  { href: '/search', icon: Search, label: 'Buscar' },
  { href: '/notifications', icon: Bell, label: 'Notificaciones' },
  { href: '/profile', icon: User, label: 'Perfil' },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();


  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-dark-5 border-r border-gray-200 dark:border-gray-700 flex-col justify-between px-6 py-8 z-50">
      {/* Top section: logo y navegación */}
      <div>
        <h1 className="text-2xl font-semibold mb-10 flex items-center gap-2 justify-start">
          <span className='bg-gradient-to-bl from-primary-light via-primary/85 via-70% to-primary-dark rounded-lg p-1'><Infinity size={42} /></span>
          Carpool
        </h1>
        <nav className="flex flex-col gap-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-600 hover:text-primary'
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
      <div className="text-sm text-gray-600 flex flex-col gap-1">
        <span className="font-medium px-4 flex items-center gap-1"><UserCircle2 size={14}/>{user?.username}</span>
        <button
          onClick={logout}
          className="text-red-500 hover:bg-red-100 dark:hover:bg-red-950 px-4 py-2 font-medium transition-colors text-left rounded-md cursor-pointer flex items-center gap-2"
        > 
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
