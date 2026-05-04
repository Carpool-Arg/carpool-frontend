'use client';

import {  HEADER_PATHS } from '@/constants/paths/layout/headerPaths';
import { AppHeader } from '@/widgets/AppHeader';
import MobileNavbar from '@/widgets/mobile/MobileNavbar';
import { usePathname } from 'next/navigation';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showHeader = HEADER_PATHS.some(route => pathname.startsWith(route));

  const logoHeaderPaths = ["/home","/search"];
  const isLogoHeader = logoHeaderPaths.some(route => pathname.startsWith(route));
  
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && (
        <AppHeader showBack={!isLogoHeader} variant={isLogoHeader ? "logo" : "default"} />
      )}
      <div className="flex flex-col flex-1 px-6 sm:px-8 py-4 pb-16">
        {children}
      </div>

      <MobileNavbar />
    </div>

  );
}
