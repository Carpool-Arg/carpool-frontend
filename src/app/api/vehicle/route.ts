import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// GET: Listar vehículos del usuario
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const endpoint = id
      ? `${apiUrl}/vehicles/${id}`
      : `${apiUrl}/vehicles/my-vehicles`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { data, state, messages } = await response.json();

    if (!response.ok || state !== "OK") {
      return NextResponse.json(
        {
          success: false,
          message: messages?.[0] || "Error al obtener vehículo(s)",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Error en la API de vehículos",
        detail: error.message,
      }),
      {status: 500}
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const body = await req.json();

    const response = await fetch(`${apiUrl}/vehicles`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" ,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.state !== 'OK') {
      return NextResponse.json(
        {
          success: false,
          message: data.messages?.[0] || 'Error en cargar vehículos',
        },
        { status: response.status }
      );
    }

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error en la API de cargar vehículos", detail: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}