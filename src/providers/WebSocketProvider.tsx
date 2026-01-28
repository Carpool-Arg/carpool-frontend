'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { connectWebSocket, disconnectWebSocket } from '@/lib/websocket';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/authContext';
import { NotificationType } from '@/shared/types/notification';

interface WebSocketContextType {
  isConnected: boolean;
  reconnect: (newToken: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket debe usarse dentro de WebSocketProvider');
  return context;
};

export function WebSocketProvider({
  children,
  token: initialToken, // Token que viene del layout (Cookies / F5)
}: {
  children: React.ReactNode;
  token: string | null;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const { showNotification } = useNotification();
  const { user, accessToken } = useAuth(); // Token que viene del Login

  const connect = useCallback((tokenToConnect: string) => {
    if (!tokenToConnect) return;
    
    disconnectWebSocket(); // limpiar el ws antes

    connectWebSocket(tokenToConnect, (payload: any) => {
      showNotification({
        type: NotificationType.PAYMENT_PENDING,
        title: payload.pushTitle,
        message: payload.pushBody,
        data: payload.data,
      });
    });

    setIsConnected(true);
  }, [showNotification]);

  const reconnect = useCallback((newToken: string) => {
    connect(newToken);
  }, [connect]);

  useEffect(() => {
    // Lógica de Conexión:
    // 1. Si hay un accessToken en Auth (se acaba de ahcer login), usarlo.
    // 2. Si no, usa el initialToken (f5).
    const effectiveToken = accessToken || initialToken;

    if (user && effectiveToken && !isConnected) {
      connect(effectiveToken);
    }

    // Si el usuario hace logout, desconectar el ws
    if (!user && isConnected) {
      disconnectWebSocket();
      setIsConnected(false);
    }
  }, [user, accessToken, initialToken, isConnected, connect]);

  return (
    <WebSocketContext.Provider value={{ isConnected, reconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}