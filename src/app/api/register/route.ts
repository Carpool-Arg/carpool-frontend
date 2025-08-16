import { NextRequest, NextResponse } from "next/server";

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

    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: backendHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.state !== 'OK') {
      return NextResponse.json(
        {
          success: false,
          message: data.messages?.[0] || 'Error en login',
        },
        { status: response.status }
      );
    }

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    return new NextResponse(
      JSON.stringify({ message: "Error en la API de register", detail: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
