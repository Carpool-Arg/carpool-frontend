import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: Listar los tipos de vehículos
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const response = await fetch(`${apiUrl}/vehicle-types`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data, state, messages } = await response.json();

    if (!response.ok || state !== "OK") {
      return NextResponse.json(
        {
          success: false,
          message: messages?.[0] || "Error al obtener los tipos de vehículo(s)",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Error en la API de tipo de vehículos",
        detail: error.message,
      }),
      {status: 500}
    );
  }
}