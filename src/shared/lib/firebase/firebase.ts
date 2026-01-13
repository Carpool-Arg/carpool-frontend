import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, MessagePayload } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      console.warn('FCM no soportado en este navegador.');
      return null;
    }

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      let registration;

      if ('serviceWorker' in navigator) {
        // 1. Intentar obtener el registro existente de sw.js
        registration = await navigator.serviceWorker.getRegistration('/');
        
        // 2. Si no lo encuentra (o es undefined), esperar al .ready
        if (!registration) {
          
          registration = await navigator.serviceWorker.ready;
        }
      }

      if (!registration) {
        throw new Error("No se encontró ningún Service Worker activo.");
      }

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration, 
      });
      
      return token;
    } else {
      console.warn('Permiso de notificaciones denegado.');
      return null;
    }
  } catch (error) {
    console.error('Error CRÍTICO al obtener token:', error);
    return null;
  }
};

// ------------------------------------------------------------------
// CORRECCIÓN AQUÍ: Cambiamos de Promise a Callback (Observer Pattern)
// ------------------------------------------------------------------
export const onMessageListener = (callback: (payload: MessagePayload) => void) => {
  isSupported().then((supported) => {
    if (supported) {
      const messaging = getMessaging(app);
      
      // onMessage devuelve una función unsubscribe que podrías retornar si quisieras limpiar
      return onMessage(messaging, (payload) => {
        // Cuando llega un mensaje, ejecutamos la función que nos pasó el componente
        callback(payload);
      });
    }
  });
};