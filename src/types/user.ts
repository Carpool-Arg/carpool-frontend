export interface User {
  id: number | null;
  username: string;
  name: string;
  lastname: string;
  dni: string;
  email: string;
  gender: string;
  phone: string;
  status?: string;
  profileImage?: string;
  roles: Array<'user' | 'driver' | null>;
  birthDate: string
}
