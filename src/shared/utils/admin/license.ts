export function isLicenseExpired(date: string): boolean {
  return new Date(date).getTime() < Date.now();
}