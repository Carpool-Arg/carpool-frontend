import { useNotification } from '@/contexts/NotificationContext';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient: Stomp.Client | null = null;

export const connectWebSocket = (
  token: string,
   onMessage: (payload: unknown) => void
) => {
  console.log('🔍 CONECTANDO WS CON TOKEN:', token ? `${token.substring(0, 30)}...` : 'NO HAY TOKEN');
  
  const socket = new SockJS(
    `${process.env.NEXT_PUBLIC_API_URL}/ws`
  );

  stompClient = Stomp.over(socket);
  stompClient.debug = () => {};

  stompClient.connect(
    { Authorization: `Bearer ${token}` },
    () => {
      stompClient?.subscribe('/user/queue/notification', (message) => {
        const payload = JSON.parse(message.body);
        console.log(payload)
        onMessage(payload);
      });
    }
  );
};

// AGREGAR ESTA FUNCIÓN
export const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('WS desconectado');
    });
    stompClient = null;
  }
};