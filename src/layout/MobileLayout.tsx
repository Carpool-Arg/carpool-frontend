'use client';
import { AppHeader } from '@/components/navigation/mobile/AppHeader';
import MobileNavbar from '@/components/navigation/mobile/MobileNavbar';
import {  HEADER_PATHS } from '@/constants/publicPaths';
import { usePathname } from 'next/navigation';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showHeader = HEADER_PATHS.some(route => pathname.startsWith(route));

  const logoHeaderPaths = ["/home","/search"];
  const isLogoHeader = logoHeaderPaths.some(route => pathname.startsWith(route));
  
  return (
    <div className="flex flex-col h-screen">
      {showHeader && (
        <AppHeader showBack={!isLogoHeader} variant={isLogoHeader ? "logo" : "default"} />
      )}
      <main className="flex-1 overflow-auto pt-8 pr-8 pl-8 pb-[80px]">
        {children}
      </main>
      <MobileNavbar />
    </div>

  );
}
