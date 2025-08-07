import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { email, ...rest } = body;

    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: "Falta el campo 'email' en el body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const token = req.cookies.get('token')?.value;
    console.log('token',token)

    const response = await fetch(`${apiUrl}/users/complete-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, ...rest }),
    });

    const data = await response.json();

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
      JSON.stringify({
        message: "Error en la API de complete registration",
        detail: message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
