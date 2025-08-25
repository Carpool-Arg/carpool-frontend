import { CompleteRegistrationFormData, LoginFormData, RegisterFormData } from "@/types/forms";
import { CompleteRegResponse, GoogleLoginResponse, LoginResponse, VoidResponse } from "@/types/response/auth";

// src/services/authService.ts
export const loginUser = async (data: LoginFormData & { recaptchaToken?: string }): Promise<{
  success: boolean;
  data?: LoginResponse;
  error?: string;
  state?: string;
  messages?: string[];
}> => {
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

    const result = await res.json();
    console.log('result',result)

    if (res.ok && result.success) {
      return { success: true, data: result };
    } else {
      return { 
        success: false, 
        error: result.message || 'Login failed',
        state: result.state,
        messages: result.messages,
      };
    }
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, error: message || 'Network error' };
  }
};

export const authWithGoogle = async (idToken: string): Promise<{ success: boolean; data?: GoogleLoginResponse['data']; error?: string }> => {
  try {
    const res = await fetch('/api/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ idToken }),
    });

    const result = await res.json();
    console.log('result del Service',result)

    if (res.ok && result.success) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.message || 'Fallo login con Google' };
    }
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, error: message || 'Error de red' };
  }
};


export async function completeRegistration(email: string, data: CompleteRegistrationFormData): Promise<{
  success:boolean;
  data?:CompleteRegResponse;
  message?: string}
> {
  try {
    const body = { ...data, email };

    const res = await fetch(`/api/complete-registration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include', 
    });

    if (!res.ok){
      throw new Error('Datos inválidos')
      }

    const response: CompleteRegResponse = await res.json();

    return {success: true, data: response}
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    return {success: false, message: message}
  }
}

export async function registerUser(data: RegisterFormData & { recaptchaToken?: string }): Promise<{
    success:boolean;
    data?:VoidResponse;
    message?: string}
> {
    try {
        const { recaptchaToken, ...registerData } = data;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (recaptchaToken) {
          headers['recaptcha'] = recaptchaToken;
        }

        const res = await fetch('/api/register',{
            method: 'POST',
            headers,  //equivalente a headers: headers
            body: JSON.stringify(registerData),
        })

        const responseBody = await res.json();

        if (!res.ok) {
          throw new Error(responseBody.message || 'Error desconocido');
        }

        return { success: true, data: responseBody };
    } catch (error: unknown) {
      let message = "Error desconocido";

      if (error instanceof Error) {
        message = error.message;
      }
      return {success: false, message: message}
   }
} 

export async function logoutUser(): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const res = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Error al cerrar sesión');
    }

    return { success: true };
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message: message };
  }
}

