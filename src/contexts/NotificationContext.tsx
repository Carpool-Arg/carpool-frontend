'use client';

import { NotificationPayload, NotificationType } from '@/shared/types/notification';
import { createContext, useContext, useState } from 'react';


interface NotificationContextType {
  unpaidNotification: NotificationPayload | null;
  showNotification: (n: NotificationPayload) => void;
  clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [unpaidNotification, setUnpaidNotification] =
    useState<NotificationPayload | null>(null);

  const showNotification = (notification: NotificationPayload) => {
    if (notification.type === NotificationType.PAYMENT_PENDING) {
      setUnpaidNotification(notification);
    }
  };

  const clearNotification = () => setUnpaidNotification(null);

  return (
    <NotificationContext.Provider
      value={{ unpaidNotification, showNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};
