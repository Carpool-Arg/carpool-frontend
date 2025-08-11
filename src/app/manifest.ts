import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Carpool - Compartí viajes',
    short_name: 'Carpool',
    description: 'Aplicación para compartir viajes y reducir costos de transporte',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#3e3e42',
    orientation: 'portrait-primary',
    lang: 'es-AR',
    scope: '/',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any' 
      }
    ],
    shortcuts: [
      {
        name: 'Mis viajes',
        short_name: 'Viajes',
        description: 'Ver viajes en los que participás',
        url: '/trips',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
      },
      {
        name: 'Publicar viaje',
        short_name: 'Publicar',
        description: 'Crear un nuevo viaje como conductor',
        url: '/trips/new',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
      }
    ]
  }
}
