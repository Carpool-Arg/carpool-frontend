import { GoogleLoginResponse } from "@/types/response/auth";
import { NextRequest, NextResponse } from "next/server";
import { parseJwt } from "@/utils/jwt";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    const res = await fetch(`${apiUrl}/auth-google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data: GoogleLoginResponse = await res.json();
    console.log('data',data)

    if (!res.ok || data.state !== "OK") {
      return NextResponse.json(
        { success: false, message: data.messages || "Error desde backend" },
        { status: res.status }
      );
    }

    const { accessToken, refreshToken } = data.data;
    console.log('data.data', data.data)

    // Caso 1: El usuario necesita completar perfil (no hay token)
    
    // Caso 2: Usuario activo, continuar con login
    const decoded = parseJwt(accessToken);
    const iat = Number(decoded?.iat);
    const exp = Number(decoded?.exp);
    const maxAge = exp > iat ? exp - iat : 60 * 60 * 2;

    const response = NextResponse.json({
      data: data.data,
      success: true,
      user: {
        username: decoded?.username,
      },
      needsAction: false,
    });

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    
    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
    }
    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    
    console.error("Error en api/auth/google:", message);
    return NextResponse.json(
      { success: false, message: "Error interno en el servidor" },
      { status: 500 }
    );
  }
}
