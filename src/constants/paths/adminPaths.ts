import { IdCard, LayoutDashboard, Settings } from "lucide-react";

export const ADMIN_PATHS = [
  '/admin'
];

// TITULOS DEL NAVBAR
export const ROUTE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/licenses': 'Licencias',
  '/dashboard/settings': 'Ajustes',
}

// ITEMS DEL SIDEBAR
export const NAV_ITEMS = [
  {
    section: 'General',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Licencias', href: '/admin/licenses', icon: IdCard },
    ],
  },
  {
    section: 'Configuración',
    items: [
      { label: 'Ajustes', href: '/admin/settings', icon: Settings },
    ],
  },
]
