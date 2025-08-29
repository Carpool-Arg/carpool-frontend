import { CompleteRegistrationFormData, LoginFormData, RegisterFormData } from "@/types/forms";
import { CompleteRegResponse, GoogleLoginResponse, LoginResponse } from "@/types/response/auth";
import { VoidResponse } from "@/types/response/response";

/**
 * Inicia sesión con email y contraseña.
 * 
 * @param {(LoginFormData & { recaptchaToken?: string })} data - Credenciales para iniciar sesión.
 * @returns {Promise<LoginResponse>} - Respuesta estándar.
 */
export const loginUser = async (data: LoginFormData & { recaptchaToken?: string }): Promise<LoginResponse> => {
  try {
    const { recaptchaToken, ...loginData } = data;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (recaptchaToken) {
      headers['recaptcha'] = recaptchaToken;
    }

    const res = await fetch('/api/login', {
      method: 'POST',
      headers, //equivalente a headers: headers
      body: JSON.stringify(loginData),
      credentials: 'include',
    });

    const response: LoginResponse = await res.json();
    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
};

/**
 * Autentica al usuario usando Google Sign-In.
 *
 * @param {string} idToken - Token de Google generado en el cliente.
 * @returns {Promise<GoogleLoginResponse>} - Respuesta estándar.
 */
export const authWithGoogle = async (idToken: string): Promise<GoogleLoginResponse> => {
  try {
    const res = await fetch('/api/auth-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ idToken }),
    });

    const response: GoogleLoginResponse = await res.json();
    
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return { data: null, messages: [message], state: "ERROR" };
  }
};

/**
 * Completa el registro de un usuario con información adicional.
 * para el caso de registro con google.
 * 
 * @param {string} email - Correo del usuario a completar el registro.
 * @param {CompleteRegistrationFormData} data - Datos adicionales para completar el registro.
 * @returns {Promise<CompleteRegResponse>} - Respuesta estándar del registro completado.
 */
export async function completeRegistration(email: string, data: CompleteRegistrationFormData): Promise<CompleteRegResponse> {
  try {
    const body = { ...data, email };

    const res = await fetch(`/api/users/complete-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include', 
    });

    const response: CompleteRegResponse = await res.json();

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return { data: null, messages: [message], state: "ERROR" };
  }
}

/**
 * Registra un nuevo usuario en la plataforma.
 *
 * @param {RegisterFormData & { recaptchaToken?: string }} data - Datos de registro, opcionalmente con token de reCAPTCHA.
 * @returns {Promise<VoidResponse>} - Respuesta estándar.
 */
export async function registerUser(data: RegisterFormData & { recaptchaToken?: string }): Promise<VoidResponse> {
  try {
    const { recaptchaToken, ...registerData } = data;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (recaptchaToken) {
      headers['recaptcha'] = recaptchaToken;
    }

    const res = await fetch('/api/users',{
        method: 'POST',
        headers,  //equivalente a headers: headers
        body: JSON.stringify(registerData),
    })

    const response: VoidResponse = await res.json();
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return { data: null, messages: [message], state: "ERROR" };
  }
} 

/**
 * Cierra la sesión del usuario actual.
 *
 * @returns {Promise<VoidResponse>} - Respuesta estándar.
 */
export async function logoutUser(): Promise<VoidResponse> {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    const response: VoidResponse = await res.json();

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return { data: null, messages: [message], state: "ERROR" };
  }
}

