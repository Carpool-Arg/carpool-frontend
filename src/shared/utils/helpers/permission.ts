import { ROUTE_PERMISSIONS } from "@/constants/paths/permissions/routePermissions";

const matchPath = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(route + '/');

export const canAccessRoute = (pathname: string, userRoles: string[]) => {
  const match = ROUTE_PERMISSIONS.find(route =>
    matchPath(pathname, route.path)
  );

  if (!match) return true;
  if (match.roles === 'all') return true;

  // Si tiene algún rol excluido, no puede pasar
  if (match.excludeRoles?.some(role => userRoles.includes(role))) return false;

  // Alcanza con tener AL MENOS UNO de los roles requeridos
  return match.roles.some(role => userRoles.includes(role));
};