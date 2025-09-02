'use client'

import DesktopSidebar from "@/components/navigation/desktop/DesktopSidebar";
import { AppHeader } from "@/components/navigation/mobile/AppHeader";
import { HEADER_PATHS } from "@/constants/publicPaths";
import { usePathname } from "next/navigation";

const pathToRegex = (path: string): RegExp => {
  const regex = path.replace(/:[^/]+/g, "[^/]+"); // reemplaza ":id" por "([^/]+)"
  return new RegExp(`^${regex}$`);
};

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowedPaths = ['/home', '/search', '/notifications', '/profile', '/register-driver', '/settings','/vehicle', '/vehicle/new'];
  const shouldShowSidebar = allowedPaths.some((path) => pathname.startsWith(path));

  const showHeader = HEADER_PATHS.some(route => pathname.startsWith(route));

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
