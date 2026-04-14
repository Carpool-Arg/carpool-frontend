import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { PUBLIC_PATHS } from "@/constants/paths/publicPaths";
import { canAccessRoute } from "../utils/helpers/permission";

export function useRouteGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';

  const [checking, setChecking] = useState(true);

  const isPublicRoute = PUBLIC_PATHS.pages.includes(
    pathname as typeof PUBLIC_PATHS.pages[number]
  );

  useEffect(() => {
    if (loading) return;

    // no logueado
    if (!user && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    // logueado en ruta pública
    if (user && isPublicRoute) {
      router.replace('/home');
      return;
    }

    // permisos
    if (user) {
      const hasAccess = canAccessRoute(pathname, user.roles || []);
      if (!hasAccess) {
        router.replace('/home');
        return;
      }
    }

    setChecking(false);
  }, [user, loading, pathname, router, isPublicRoute]);

  return checking;
}