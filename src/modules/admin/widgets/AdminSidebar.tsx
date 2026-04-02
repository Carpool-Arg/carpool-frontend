'use client'

import { AlertDialog } from '@/components/ux/AlertDialog'
import { R2_PUBLIC_PREFIX } from '@/constants/imagesR2'
import { useAuth } from '@/contexts/authContext'
import {
  FileText,
  IdCard,
  LayoutDashboard,
  LogOut,
  Settings
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  {
    section: 'General',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Licencias', href: '/admin/licenses', icon: IdCard },
      { label: 'Reportes', href: '/dashboard/reportes', icon: FileText },
    ],
  },
  {
    section: 'Configuración',
    items: [
      { label: 'Ajustes', href: '/dashboard/ajustes', icon: Settings },
    ],
  },
]

export default function AdminSidebar() {
  const {logout} = useAuth();
  const pathname = usePathname();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    setIsDialogOpen(false);
  };

  return (
    <aside className="w-55 shrink-0 bg-[#111] flex flex-col border-r border-white/6 h-screen sticky top-0">
      {/* Logo */}
      <div className="h-13 flex items-center px-5 border-b border-white/6 gap-2">
        <Image
          src={`${R2_PUBLIC_PREFIX}/isologo-cropped.svg`}
          alt="Imagen de login"
          width={28}
          height={28}
          className="object-contain dark:invert"
          priority
        />
        <span className="text-base font-medium text-white tracking-wide">
          Carpool
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section}>
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest px-5 pt-4 pb-1.5">
              {group.section}
            </p>
            {group.items.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-5 py-2.5 text-[13px] transition-colors border-l-2 ${
                    isActive
                      ? 'text-white bg-white/6 border-white'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/4 border-transparent'
                  }`}
                >
                  <Icon size={15} strokeWidth={1.8} />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/6 py-3">
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center cursor-pointer gap-2.5 px-5 py-2.5 text-[13px] text-white/50 hover:text-white/80 hover:bg-white/4 w-full transition-colors border-l-2 border-transparent">
          <LogOut size={15} strokeWidth={1.8} />
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
  )
}