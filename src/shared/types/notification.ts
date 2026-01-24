export enum NotificationType {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  RESERVATION_ACCEPTED = 'RESERVATION_ACCEPTED',
}

export interface PaymentPendingData {
  paymentId: number;
  reservationId: number;
  total: number;
  currency: 'ARS' | 'USD';
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  data?: PaymentPendingData;
}
