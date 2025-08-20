import { VoidResponse } from "@/types/response/response";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Registra a un usuario
 *
 * Recibe los datos del usuario, realiza la llamada 
 * al backend para registrarlo, devuelve la respuesta
 * estándar de tipo VoidResponse.
 * 
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con el estado de la actualización
 */
export async function POST(req: NextRequest) {
  try {
    // Recibir el body de la petición
    const body = await req.json();

    // Extraer el token recaptcha de la cookie
    const recaptchaToken = req.headers.get('recaptcha');

    // Preparar headers para el backend
    const backendHeaders: Record<string, string> = {
      "Content-Type": "application/json"
    };

    // Si hay token de reCAPTCHA, agregarlo al header
    if (recaptchaToken) {
      backendHeaders['recaptcha'] = recaptchaToken;
    }

    // Llamar al backend para registrar al usuario
    const res = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: backendHeaders,
      body: JSON.stringify(body),
    });

    const response: VoidResponse = await res.json();

    // Devolver respuesta estandarizada
    return NextResponse.json(response, { status: res.status });
  } catch (error: unknown) {
    // Manejo de errores
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { data: null, messages: [message], state: "ERROR" }, 
      { status: 500 }
    );
  }
}
