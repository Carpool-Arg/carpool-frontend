import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient: Stomp.Client | null = null;

export const connectWebSocket = (
  token: string,
  onMessage: (payload: unknown) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
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
          onMessage(payload);
        });

        resolve(); 
      },
      (error) => {
        console.error("WS connection error:", error);
        reject(error);
      }
    );
  });
};


export const disconnectWebSocket = (): Promise<void> => {
  return new Promise((resolve) => {
    if (stompClient && stompClient.connected) {
      stompClient.disconnect(() => {
        stompClient = null;
        resolve();
      });
    } else {
      resolve();
    }
  });
};