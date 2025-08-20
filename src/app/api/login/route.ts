import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/types/response/auth";
import { parseJwt } from "@/utils/jwt";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Inicia sesión con email y contraseña.
 *
 * Recibe las credenciales de autenticación, realiza la llamada 
 * al backend para iniciar sesión, devuelve la respuesta
 * estándar de tipo LoginResponse y agrega/actualiza el access y el refresh token a las cookies.
 * 
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con el estado de la actualización
 */
export async function POST(req: NextRequest) {
  // Extraer recaptcha token y preparar headers 
  const recaptchaToken = req.headers.get('recaptcha');
  const backendHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (recaptchaToken) backendHeaders['recaptcha'] = recaptchaToken;

  try {
    // Recibir el body de la petición
    const body = await req.json();

    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: backendHeaders,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      const errorRes = NextResponse.json(
        { data: null, messages: [errorText], state: "ERROR" },
        { status: res.status }
      );
      
      // Limpiar cookies si falla
      errorRes.cookies.delete('token');
      errorRes.cookies.delete('refreshToken');

      return errorRes;
    }

    const response: LoginResponse = await res.json();

    const accessToken = response.data?.accessToken;
    const refreshToken = response.data?.refreshToken;

    // Guardar nuevos tokens en cookies
    const nextRes = NextResponse.json(response, { status: res.status });

    if (accessToken) {
      // Decodificar el token para calcular la duración
      const decoded = parseJwt(accessToken);
      const iat = Number(decoded?.iat);
      const exp = Number(decoded?.exp);
      const maxAge = exp > iat ? exp - iat : 60 * 60 * 2; // 2 horas por defecto

      nextRes.cookies.set('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge, // Setear la duración
      })
    }

    if (refreshToken) {
      nextRes.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
    }

    // Devolver respuesta estandarizada
    return nextRes;
  } catch (error: unknown) {
    // Manejo de errores inesperados
    const message = error instanceof Error ? error.message : "Error desconocido";
    const errorRes = NextResponse.json(
      { data: null, messages: [message], state: "ERROR" },
      { status: 500 }
    );
    errorRes.cookies.delete('token');
    errorRes.cookies.delete('refreshToken');
    return errorRes;
  }
}