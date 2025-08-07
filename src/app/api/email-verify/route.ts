import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token= body.token;

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Falta el parámetro 'token'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const response = await fetch(`${apiUrl}/users/activate-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({token}),
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
      JSON.stringify({ message: "Error en la API de complete registration", detail: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
