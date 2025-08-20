import { fetchWithRefresh } from "@/lib/http/authInterceptor";
import { UserResponse } from "@/types/response/user";
import { parseJwt } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Actualiza el perfil de un usuario.
 *
 * Recibe los datos del perfil desde la petición, realiza la llamada 
 * al backend para actualizar la información, devuelve la respuesta
 * estándar de tipo UserResponse y actualiza el access y el refresh token.
 * 
 * @param {NextRequest} req - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON con el estado de la actualización
 */

export async function PUT(req: NextRequest) {
  try {
    // Recibir FormData de la petición
    const formData = await req.formData();
    const token = req.cookies.get('token')?.value;

    // Llamada al backend con interceptor para refresco de tokens
    const res = await fetchWithRefresh(`${apiUrl}/users/update-profile`, {
      method: "PUT",
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
      body: formData, 
    });

    const response: UserResponse = await res.json();

    const newAccessToken = response.data?.accessToken;
    const newRefreshToken = response.data?.refreshToken;

    // Guardar nuevos tokens en cookies
    const nextRes = NextResponse.json(response, { status: res.status });

    if (newAccessToken) {
      const decoded = parseJwt(newAccessToken);
      const iat = Number(decoded?.iat);
      const exp = Number(decoded?.exp);
      const maxAge = exp > iat ? exp - iat : 60 * 60 * 2; // 2 horas por defecto

      nextRes.cookies.set("token", newAccessToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
      });
    }

    if (newRefreshToken) {
      nextRes.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
    }

    // Devolver respuesta estandarizada
    return nextRes;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { data: null, messages: [message], state: "ERROR" }, 
      { status: 500 }
    );
  }
}
