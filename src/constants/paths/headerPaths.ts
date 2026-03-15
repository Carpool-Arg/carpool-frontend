export const HEADER_PATHS = [
  '/reservations/', 
  '/search',
  '/trip/edit',
  '/trip/details',
  '/trip/new',
  '/trip', '/trips',
  '/reviews/driver/',
  '/reviews/from-me',
  '/reviews/to-me',
  '/reservations',
  '/vehicle/edit',
  '/vehicle/new',
  '/vehicle',
  '/profile/details',
  '/profile',
  '/register-driver',
  '/driver-review/trip/',
  '/settings/account/update-password',
  '/settings/account/update-email',
  '/settings/account',
  '/settings/security',
  '/settings',
  '/home',
  '/account/reviews'
] as const;

export const HEADER_TITLES: Record<string, string> = {
  '/trips': 'Viajes',
  '/trip/edit': 'Editar viaje',
  '/trip/new': 'Publicar viaje',
  '/trip/details': 'Detalles del viaje',
  '/reviews/driver/':'Reseñas',
  '/reviews/from-me':'Reseñas que has hecho',
  '/reviews/to-me': 'Reseñas que te han hecho',
  '/vehicle/edit': 'Editar Vehículo',
  '/vehicle/new': 'Registrar Vehículo',
  '/vehicle': 'Vehículos',
  '/profile/details': 'Perfil',
  '/profile': 'Perfil de usuario',
  '/register-driver': 'Registrar conductor',
  '/reservations/':'Reservas del viaje', 
  '/reservations':'Viajes',
  '/driver-review/trip/': 'Reseñar al chofer',
  '/settings/account/update-password': 'Contraseña',
  '/settings/account/update-email': 'Correo electrónico',
  '/settings/account': 'Cuenta',
  '/settings/security': 'Seguridad',
  '/settings': 'Configuración',
  '/account/reviews': 'Consulta de reseñas' 
};

export const getMatchingHeaderPath = (pathname: string) => {
  return [...HEADER_PATHS]
    .sort((a, b) => b.length - a.length)
    .find(route => pathname.startsWith(route));
};
