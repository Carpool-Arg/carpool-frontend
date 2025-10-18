export const PUBLIC_PATHS = {
  pages: [
    '/',
    '/login',
    '/register',
    '/email-verify',
    '/email-verified',
    '/send-change-password-email',
    '/password-change',
    '/complete-profile',
    '/unlock-account',
  ],
  api: [
    '/api/login',
    '/api/auth-google',
    '/api/auth/refresh',
    '/api/users',
    '/api/users/activate-account',
    '/api/users/complete-registration',
    '/api/users/resend-activation',
    '/api/password-change/send-email',
    '/api/password-change',
    '/api/users/unlock-account',
  ],
} as const;

export const HEADER_PATHS = [
  '/trip/details',
  '/trip/new',
  '/trip',
  '/vehicle/edit',
  '/vehicle/new',
  '/vehicle',
  '/profile/details',
  '/profile',
  '/register-driver',
  '/settings/account/update-password',
  '/settings/account/update-email',
  '/settings/account',
  '/settings/security',
  '/settings'
] as const;

export const HEADER_TITLES: Record<string, string> = {
  '/trip/details': 'Mis viajes',
   '/trip/new': 'Publicar viaje',
  '/vehicle/edit': 'Editar Vehículo',
  '/vehicle/new': 'Registrar Vehículo',
  '/vehicle': 'Vehículos',
  '/profile/details': 'Perfil',
  '/profile': 'Perfil de usuario',
  '/register-driver': 'Registrar conductor',
  '/settings/account/update-password': 'Contraseña',
  '/settings/account/update-email': 'Correo electrónico',
  '/settings/account': 'Cuenta',
  '/settings/security': 'Seguridad',
  '/settings': 'Configuración'
};

export const getMatchingHeaderPath = (pathname: string) => {
  return HEADER_PATHS
    .sort((a, b) => b.length - a.length) // rutas más específicas primero
    .find(route => pathname.startsWith(route));
};