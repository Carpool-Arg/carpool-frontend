'use client'


import { HEADER_PATHS } from "@/constants/paths/headerPaths";
import { PROTECTED_PATHS } from "@/constants/paths/protectedPaths";
import { AppHeader } from "@/widgets/AppHeader";
import DesktopSidebar from "@/widgets/desktop/DesktopSidebar";
import { usePathname } from "next/navigation";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const shouldShowSidebar = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const showHeader = HEADER_PATHS.some(route => pathname.startsWith(route));

  const logoHeaderPaths = [ "/home", "/search"];
  const isLogoHeader = logoHeaderPaths.some(route => pathname.startsWith(route));
  

  return (
    <div className="flex h-screen">
      {shouldShowSidebar && <DesktopSidebar />}

    <main
      className={`${shouldShowSidebar ? 'ml-64' : ''} flex-1`}
      style={{
        height: showHeader ? 'calc(100vh - 2.5rem)' : '100vh', // h-10 = 2.5rem
      }}
    >
      {showHeader && (
        <AppHeader showBack={!isLogoHeader} variant={isLogoHeader ? "logo" : "default"} />
      )}
      <div className="h-full overflow-auto">
        {children}
      </div>
    </main>

    </div>
  );
}
