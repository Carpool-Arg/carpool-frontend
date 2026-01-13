'use client';
import { useEffect } from 'react';

// 1. Definimos una interfaz mínima para los eventos de Workbox
interface WorkboxEvent {
  isUpdate?: boolean;
  type?: string;
  target?: unknown;
}

// 2. Definimos la forma básica del objeto Workbox que usamos
interface Workbox {
  addEventListener: (
    event: string, 
    callback: (event: WorkboxEvent) => void
  ) => void;
  register: () => Promise<void>;
  messageSkipWaiting: () => void;
}

// 3. Extendemos Window usando nuestra interfaz tipada (Adiós 'any')
declare global {
  interface Window {
    workbox: Workbox;
  }
}

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Verificamos si window.workbox está definido
    if (
      typeof window !== 'undefined' && 
      'serviceWorker' in navigator && 
      window.workbox !== undefined
    ) {
      
      const wb = window.workbox;
      
      wb.register();
      
    } else if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.error('[SW] Falló el registro manual:', err));
    }
  }, []);

  return null;
}