export function translateTripState(state: string): string {
  const map: Record<string, string> = {
    CREATED: "Creado",
    CLOSED: "Cerrado",
    FINISHED: "Finalizado",
    CANCELLED: "Cancelado"
  };

  return map[state] ?? state;
}