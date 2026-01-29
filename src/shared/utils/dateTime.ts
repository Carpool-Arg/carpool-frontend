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

/**
 * Devuelve el tiempo restante hasta una fecha en formato humano.
 *
 * @example
 * timeUntil("2026-01-21T19:30:00")
 * // → "1 h 26 min"
 *
 * @example
 * timeUntil("2026-01-21T18:05:00")
 * // → "5 min"
 *
 * @example
 * timeUntil("2026-01-21T18:00:00")
 * // → "Llegando"
 *
 * @param dateString Fecha y hora objetivo (ISO). Puede ser undefined.
 * @returns Tiempo restante en formato humano o null si no hay fecha.
 */
export function timeUntil(dateString: string | undefined): string | null {
  if (!dateString) return null

  const now = new Date()
  const target = new Date(dateString)

  const diffMs = target.getTime() - now.getTime()
  const totalMinutes = Math.max(0, Math.round(diffMs / 60000))

  if (totalMinutes === 0) return "Llegando"

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) {
    return `${hours} h ${minutes} min`
  }

  if (hours > 0) {
    return `${hours} h`
  }

  return `${minutes} min`
}


