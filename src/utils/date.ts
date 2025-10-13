export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short' })
    .format(date)
    .replace('.', '') // quita el punto que a veces aparece en "feb."
    .replace(' ', '-'); // agrega guion entre día y mes
}

export function formatDateLong(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatFullDate(dateString: string) {
  const date = new Date(dateString);

  const formatted = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date).replace(",", "");

  // Capitaliza día y mes
  return formatted
    .split(" ") // separa por espacios
    .map((word, index) => {
      // Capitaliza la primera letra del primer y último elemento (día y mes)
      if (index === 0 || index === formatted.split(" ").length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(" ");
}

