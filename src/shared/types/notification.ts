export enum NotificationType {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  RESERVATION_ACCEPTED = 'RESERVATION_ACCEPTED',
}

export interface PaymentPendingData {
  total: number;
  tripId: number;
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  data?: PaymentPendingData;
}
