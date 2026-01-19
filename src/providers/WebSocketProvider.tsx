'use client';

import { useEffect } from 'react';
import { connectWebSocket, disconnectWebSocket } from '@/lib/websocket';

export const WebSocketProvider = ({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (!token) return;

    connectWebSocket(token, (notification) => {
      console.log('📩 Notificación WS:', notification);
    });

    return () => disconnectWebSocket();
  }, [token]);

  return <>{children}</>;
};
