'use client'

import DesktopSidebar from "@/components/navigation/desktop/DesktopSidebar";
import { AppHeader } from "@/components/navigation/mobile/AppHeader";
import { usePathname } from "next/navigation";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowedPaths = ['/home', '/search', '/notifications', '/profile', '/register-driver'];
  const shouldShowSidebar = allowedPaths.some((path) => pathname.startsWith(path));

  // Definí en qué rutas querés que aparezca el header
  const showHeader = [ '/profile/details', '/settings'].includes(pathname);
  return (
    <div className="flex min-h-screen">
      {shouldShowSidebar && <DesktopSidebar />}
      <main className={`${shouldShowSidebar ? 'ml-64' : ''} flex-1`}>
        {showHeader && <AppHeader showBack />}
        {children}
      </main>
    </div>
  );
}
