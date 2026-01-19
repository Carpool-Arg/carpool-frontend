import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient: Stomp.Client | null = null;

export const connectWebSocket = (
  token: string,
  onNotification: (payload: any) => void
) => {
  const socket = new SockJS(
    `${process.env.NEXT_PUBLIC_API_URL}/ws`
  );

  stompClient = Stomp.over(socket);

  stompClient.debug = () => {}; // apagar logs

  stompClient.connect(
    {
      Authorization: `Bearer ${token}`,
    },
    () => {
      console.log('🟢 WS conectado');

      stompClient?.subscribe('/user/notification', (message) => {
        const payload = JSON.parse(message.body);
        onNotification(payload);
      });
    },
    (error) => {
      console.error('🔴 WS error', error);
    }
  );
};

export const disconnectWebSocket = () => {
  stompClient?.disconnect(() => {
    console.log('🔌 WS desconectado');
  });
};
