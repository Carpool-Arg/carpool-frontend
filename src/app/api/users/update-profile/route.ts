import { fetchWithRefresh } from "@/lib/http/authInterceptor";
import { UserResponse } from "@/types/response/user";
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
    // Recibir FormData directamente
    const formData = await req.formData();
    const token = req.cookies.get('token')?.value;

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

    const nextRes = NextResponse.json(response, { status: res.status });

    if (newAccessToken) {
      nextRes.cookies.set("token", newAccessToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    if (newRefreshToken) {
      nextRes.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return nextRes;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return NextResponse.json({
      data: null,
      messages: [message],
      state: "ERROR",
    }, { status: 500 });
  }
}
