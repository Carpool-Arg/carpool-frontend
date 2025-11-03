'use client';

import { useEffect, useState, useCallback } from 'react';
import { getFCMToken, onMessageListener } from '../lib/firebase/firebase';

interface UseNotificationsReturn {
  isTokenRegistered: boolean;
  isLoading: boolean;
  registerNotifications: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
  error: string | null;
}

export function useNotifications(): UseNotificationsReturn {
  const [isTokenRegistered, setIsTokenRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    // Registrar el service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
    }

    // Escuchar mensajes en primer plano
    onMessageListener()
    .then((payload: any) => {
      const notif = payload.notification;

      // Si no hay contenido de notificación, no mostrar nada
      if (!notif || (!notif.title && !notif.body)) return;


      if (Notification.permission === 'granted') {
        new Notification(notif.title, {
          body: notif.body,
          icon: notif.icon || '/icons/icon-192.png',
          data: payload.data,
        });
      }
    })
    .catch((err) => console.error('Error al escuchar mensajes:', err));


    // Verificar si ya está registrado (guardado en localStorage)
    const storedToken = localStorage.getItem('fcm_token_registered');
    if (storedToken) {
      setIsTokenRegistered(true);
    }
  }, []);

  const registerNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await getFCMToken();
      console.log('token',token)
      if (!token) {
        setError('No se pudo obtener el token. Verifica los permisos.');
        setIsLoading(false);
        return;
      }

      // Enviar token al backend
      const response = await fetch('/api/notification/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
        }),
        credentials: 'include',
      });

      console.log('response',response)
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error al registrar token: ${errorText}`);
        console.error('Error al registrar token:', errorText);
      } 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al registrar notificaciones: ${errorMessage}`);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('Las notificaciones no son compatibles con este navegador.');
      return 'denied';
    }

    const result = await Notification.requestPermission();
    if (result === 'granted') {
      await registerNotifications();
    }
    
    return result;
  }, [registerNotifications]);

  return {
    requestPermission,
    isTokenRegistered,
    isLoading,
    registerNotifications,
    error,
  };
}