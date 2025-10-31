// public/firebase-messaging-sw.js

// Importar Firebase scripts (versión 10.7.1 es estable)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Inicializar Firebase en el Service Worker

const firebaseConfig = {

  apiKey: "AIzaSyCjk0C-SPasb8ffO4BxCvDrf8huw1g1U-U",

  authDomain: "carpool-app-2025.firebaseapp.com",

  projectId: "carpool-app-2025",

  storageBucket: "carpool-app-2025.firebasestorage.app",

  messagingSenderId: "1065960729977",

  appId: "1:1065960729977:web:eaf3eace7f098206b953a8",

  measurementId: "G-RT4MT19BY7"

};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Manejar notificaciones en segundo plano
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensaje en segundo plano:', payload);
    
    const notificationTitle = payload.notification?.title || 'Nueva notificación';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: payload.notification?.icon || '/icon-192x192.png',
      badge: '/icon-72x72.png',
      data: payload.data || {},
      tag: 'notification-' + Date.now(),
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });

} catch (error) {
  console.error('[firebase-messaging-sw.js] Error al inicializar:', error);
}

// Manejar clicks en las notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Click en notificación:', event);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir una nueva ventana
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});