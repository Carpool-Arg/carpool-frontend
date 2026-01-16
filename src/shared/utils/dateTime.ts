/**
 * Formatea una fecha y hora en español.
 * 
 * - Si la fecha es del año actual → no muestra el año
 * - Si es de otro año → incluye el año
 *
 * @example
 * formatDateTime("2025-02-03T14:30:00")
 * // → "3 de febrero, 14:30"
 *
 * @example
 * formatDateTime("2023-11-20T09:15:00")
 * // → "20 de noviembre de 2023, 09:15"
 *
 * @example
 * formatDateTime(undefined)
 * // → ""
 *
 * @param dateString Fecha y hora en formato ISO (string). Puede ser undefined.
 * @returns String con formato "d de mes[, año], hh:mm"
 */
export function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  const isSameYear = date.getFullYear() === currentYear;

  const formattedDate = date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    ...(isSameYear ? {} : { year: "numeric" }),
  });

  const formattedTime = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate}, ${formattedTime}`;
}

/**
 * Formatea únicamente la hora de una fecha.
 *
 * @example
 * formatTime("2025-02-03T14:30:00")
 * // → "14:30"
 *
 * @example
 * formatTime(undefined)
 * // → ""
 *
 * @param dateString Fecha y hora en formato ISO (string). Puede ser undefined.
 * @returns String con formato "hh:mm"
 */
export function formatTime(dateString: string | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
