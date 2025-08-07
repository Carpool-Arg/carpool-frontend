import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    const body = await req.json();

    const response = await fetch(`${apiUrl}/drivers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" ,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    const { state, messages, data} = await response.json();


    if (!response.ok || state !== 'OK') {
      return NextResponse.json(
        {
          success: false,
          message: messages?.[0] || 'Error en registrar al conductor',
        },
        { status: response.status }
      );
    }

    const newAccessToken = data?.accessToken;
    const newRefreshToken = data?.refreshToken;

    const res = NextResponse.json({ success: true, data: data }, { status: response.status });

    if (newAccessToken) {
      res.cookies.set("token", newAccessToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    if (newRefreshToken) {
      res.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return res;
  } catch (error: unknown) {
    let message = "Error desconocido";

    if (error instanceof Error) {
      message = error.message;
    }
    return new NextResponse(
      JSON.stringify({ message: "Error en la API de drivers", detail: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
