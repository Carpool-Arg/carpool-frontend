export interface LoginFormData {
  username: string
  password: string
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  lastname: string;
  dni: string;
  phone: string;
}

export interface CompleteRegistrationFormData {
  username: string;
  password: string;
  confirmPassword: string;
  lastname: string;
  dni: string;
  phone: string;
  gender: string;
  birthDate:string;
}

export interface vehicleFormData {
  domain?: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  availableSeats: number;
  vehicleTypeId: number;
}