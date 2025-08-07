// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LoginResponse } from "@/types/response/auth";
import { parseJwt } from "@/utils/jwt";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const recaptchaToken = req.headers.get('recaptcha');

    // Preparar headers para el backend
    const backendHeaders: Record<string, string> = {
      "Content-Type": "application/json"
    };

    // Si hay token de reCAPTCHA, agregarlo al header
    if (recaptchaToken) {
      backendHeaders['recaptcha'] = recaptchaToken;
    }

    const res = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: backendHeaders,
      body: JSON.stringify(body),
    });

    const data: LoginResponse = await res.json();
    console.log('data',data)

    if (!res.ok || data.state !== 'OK') {
      return NextResponse.json(
        {
          success: false,
          messages: data.messages || 'Error en login',
        },
        { status: res.status }
      );
    }
    
    const { accessToken, refreshToken } = data.data;
    const decoded = parseJwt(accessToken);

    
    
    const iat = Number(decoded?.iat);
    const exp = Number(decoded?.exp);
    const maxAge = exp > iat ? exp - iat : 60 * 60 * 2;

    const response = NextResponse.json({
      success: true,
      user: {
        username: decoded?.username,
      }
    });

    // Cambiar sameSite a 'lax' para mejor compatibilidad
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;

  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    console.error('Login error:', message);
    return NextResponse.json(
      {
        success: false,
        message: "Error en la API de login",
        error: message,
      },
      { status: 500 }
    );
  }
}