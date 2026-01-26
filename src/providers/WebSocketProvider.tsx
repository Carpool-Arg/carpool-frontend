'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket } from '@/lib/websocket';
import { useNotification } from '@/contexts/NotificationContext';
import { NotificationType } from '@/shared/types/notification';

interface WebSocketContextType {
  isConnected: boolean;
  reconnect: (newToken: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  reconnect: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({
  children,
  token: initialToken,
}: {
  children: React.ReactNode;
  token: string | null;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const { showNotification } = useNotification();

  const connect = (token: string) => {
    disconnectWebSocket();

    connectWebSocket(token, (payload) => {
      showNotification({
        type: NotificationType.PAYMENT_PENDING,
        title: payload.pushTitle,
        message: payload.pushBody,
        data: payload.data,
      });
    });

    setIsConnected(true);
  };

  const reconnect = (newToken: string) => {
    connect(newToken);
  };

  useEffect(() => {
    if (initialToken) {
      connect(initialToken);
    }

    return () => {
      disconnectWebSocket();
      setIsConnected(false);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, reconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}
