
type Role = 'user' | 'driver' | 'admin';

export const ROUTE_PERMISSIONS: { 
  path: string; 
  roles: Role[] | 'all';
  excludeRoles?: Role[]; 
}[] = [
  { path: '/home', roles: 'all' },
  { path: '/search', roles: 'all' },
  { path: '/profile', roles: 'all' },
  { path: '/register-driver', roles: ['user'], excludeRoles: ['driver'] },
  { path: '/settings', roles: 'all' },

  { path: '/vehicle', roles: ['driver'] },
  { path: '/vehicle/new', roles: ['driver'] },

  { path: '/trip/new', roles: ['user', 'driver'] },
  { path: '/trip/details', roles: 'all' },
  { path: '/trip/edit', roles: ['driver'] },
  { path: '/trips', roles: 'all' },

  { path: '/driver-review/trip', roles: 'all' },
  { path: '/passenger-review/trip', roles: 'all' },

  { path: '/reviews/driver', roles: 'all' },
  { path: '/reviews/from-me', roles: 'all' },
  { path: '/reviews/to-me', roles: 'all' },

  { path: '/reservations', roles: ['driver'] },

  { path: '/account/reviews', roles: 'all' },

  { path: '/admin', roles: ['admin'] },
];