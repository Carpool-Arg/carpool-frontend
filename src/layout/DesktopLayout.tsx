'use client'

import DesktopSidebar from "@/components/navbar/DesktopSidebar";
import { usePathname } from "next/navigation";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowedPaths = ['/home', '/search', '/notifications', '/profile', '/register-driver'];
  const shouldShowSidebar = allowedPaths.some((path) => pathname.startsWith(path));

  return (
    <div className="flex min-h-screen">
      {shouldShowSidebar && <DesktopSidebar />}
      <main className={`${shouldShowSidebar ? 'ml-64' : ''} flex-1`}>
        {children}
      </main>
    </div>
  );
}
