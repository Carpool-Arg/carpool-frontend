import {
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Devuelve un icono de reloj (Clock1–Clock12) según la hora.
 * Redondea al reloj más cercano.
 *
 * @example
 * const Icon = getClockIcon("14:30");
 * <Icon size={16} />
 *
 * @example
 * const Icon = getClockIcon(new Date(2025, 1, 3, 9, 10));
 * // → Clock9
 */
export function getClockIcon(
  date: Date | string
): LucideIcon {
  const d = typeof date === "string" ? new Date(date) : date;

  let hour = d.getHours();
  const minutes = d.getMinutes();

  // pasa a formato 12h
  hour = hour % 12;
  if (hour === 0) hour = 12;

  // redondeo al más cercano
  if (minutes >= 30) {
    hour = hour === 12 ? 1 : hour + 1;
  }

  const clocks: Record<number, LucideIcon> = {
    1: Clock1,
    2: Clock2,
    3: Clock3,
    4: Clock4,
    5: Clock5,
    6: Clock6,
    7: Clock7,
    8: Clock8,
    9: Clock9,
    10: Clock10,
    11: Clock11,
    12: Clock12,
  };

  return clocks[hour];
}
