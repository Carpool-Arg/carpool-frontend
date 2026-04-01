'use client'

import { usePathname } from 'next/navigation'
import { Bell, PanelLeft } from 'lucide-react'

// Mapeo de rutas a títulos
const routeTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/licences': 'Licencias',
  '/dashboard/reportes': 'Reportes',
  '/dashboard/ajustes': 'Ajustes',
}

export default function AdminNavbar() {
  const pathname = usePathname()

  const title = routeTitles[pathname] ?? 'Dashboard'

  return (
    <header className="h-13 bg-black flex items-center px-5 gap-3 border-b border-white/6 shrink-0">
      <div className='flex items-center gap-2'>
        <span><PanelLeft size={20} /></span>
        <span className="text-sm text-gray-4">{title}</span>
      </div>
      

      <div className="flex-1" />

      {/* Notificaciones */}
      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/6 transition-colors">
        <Bell size={16} strokeWidth={1.8} className="text-white/50" />
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[12px] font-medium text-white/70 select-none">
        JD
      </div>
    </header>
  )
}