export type ReservationStatus = "PENDING" | "ACCEPTED";

export const RESERVATION_TABS: {
  label: string;
  value: ReservationStatus;
}[] = [
  { label: "Solicitudes", value: "PENDING" },
  { label: "Aceptadas", value: "ACCEPTED" },
];