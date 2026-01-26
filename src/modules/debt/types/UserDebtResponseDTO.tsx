export interface UserDebtResponseDTO {
  reservationId?: number;
  currency?: string;
  total?: number;
  debtUser: boolean;
  expired: boolean;
}