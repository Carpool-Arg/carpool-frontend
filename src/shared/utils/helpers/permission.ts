import { ROUTE_PERMISSIONS } from "@/constants/paths/routePermissions";

const matchPath = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(route + '/');

export const canAccessRoute = (pathname: string, userRoles: string[]) => {
  const match = ROUTE_PERMISSIONS.find(route =>
    matchPath(pathname, route.path)
  );

  if (!match) return true;

  if (match.roles === 'all') return true;

  return match.roles.some(role => userRoles.includes(role));
};