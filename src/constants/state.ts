export const STATE = [
  // Reservas
  { value: "PENDING", label: "Pendiente", scope: "RESERVATION" },
  { value: "ACCEPTED", label: "Aceptada", scope: "RESERVATION" },
  { value: "REJECTED", label: "Rechazada", scope: "RESERVATION" },
  { value: "CANCELLED", label: "Cancelada", scope: "RESERVATION" },
  { value: "COMPLETED", label: "Completada", scope: "RESERVATION" },

  // Viajes
  { value: "CREATED", label: "Creado", scope: "TRIP" },
  { value: "CLOSED", label: "Cerrado", scope: "TRIP" },
  { value: "FINISHED", label: "Finalizado", scope: "TRIP" },
];