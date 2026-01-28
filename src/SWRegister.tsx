'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const cleanAndRegister = async () => {
      try {
        // 1. Obtener TODOS los SW registrados
        const registrations = await navigator.serviceWorker.getRegistrations();

        // 2. Desregistrar todos
        for (const reg of registrations) {
          await reg.unregister();
        }

        // 3. Limpiar caches (muy importante con Workbox)
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));

        // 4. Registrar el SW nuevo
        const registration = await navigator.serviceWorker.register('/sw.js');

        // 5. Forzar reload cuando el nuevo SW toma control
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

      } catch (err) {
        console.error('[SW] Error limpiando/registrando:', err);
      }
    };

    cleanAndRegister();
  }, []);

  return null;
}
