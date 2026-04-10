export type Gender = 'MALE' | 'FEMALE' | 'UNSPECIFIED';

export function translateGender(gender?: string | null): string {
  switch (gender) {
    case 'MALE':
      return 'Masculino';
    case 'FEMALE':
      return 'Femenino';
    case 'UNSPECIFIED':
      return 'Otro';
    default:
      return '—';
  }
}