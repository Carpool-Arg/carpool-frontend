/**
 * Separa letras y números de un dominio/patente.
 *
 * @example
 * formatDomain("CCC111")
 * // → "CCC 111"
 *
 * @example
 * formatDomain("AB123CD")
 * // → "AB 123 CD"
 *
 * @param domain Dominio/patente sin espacios
 * @returns Dominio formateado con espacios
 */
export function formatDomain(domain: string): string {
  return domain
    .replace(/([a-zA-Z]+)(\d+)/g, "$1 $2")
    .replace(/(\d+)([a-zA-Z]+)/g, "$1 $2")
    .toUpperCase();
}
