'use client';
import { AppHeader } from '@/components/navigation/mobile/AppHeader';
import MobileNavbar from '@/components/navigation/mobile/MobileNavbar';
import { usePathname } from 'next/navigation';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Definí en qué rutas querés que aparezca el header
  const showHeader = ['/profile/details', '/settings', '/vehicle'].includes(pathname);

  return (
    <div className="flex flex-col h-screen">
      {showHeader && <AppHeader showBack />}
      <main className="flex-1 overflow-auto p-8">{children}</main>
      <MobileNavbar />
    </div>
  );
}
