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
}
