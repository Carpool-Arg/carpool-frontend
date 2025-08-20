import { VoidResponse } from '@/types/response/response';
import { NextRequest, NextResponse } from 'next/server'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Cierra la sesión de un usuario.
 *
 * Extrae el access token de las cookies, llama al backend para invalidarlo,
 * borra las cookies de token y refreshToken, y devuelve un VoidResponse estandarizado.
 *
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con el estado del logout
 */
export async function POST(req: NextRequest) {
  try {
    // Extraer el token de acceso de la cookie
    const accessToken = req.cookies.get('token')?.value;

    if (!accessToken) {
      return NextResponse.json({ 
        data: null, 
        messages: ["Token inválido o expirado"], 
        state: "ERROR" 
      }, { status: 400 });
    }

    // Llamar al backend para hacer logout e invalidar el token
    const res = await fetch(`${apiUrl}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const response: VoidResponse = await res.json();

    // Crear NextResponse y borrar cookies
    const nextRes = NextResponse.json(response, { status: res.status });

    nextRes.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    nextRes.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return nextRes;
  } catch (error: unknown) {
    // Manejo de errores
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { data: null, messages: [message], state: "ERROR" }, 
      { status: 500 }
    );
  }
}
