import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
    try {
        const response = await fetch(`${apiUrl}/users/genders`);

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: 'Error al obtener géneros' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        let message = "Error desconocido";

        if (error instanceof Error) {
        message = error.message;
        }
        return NextResponse.json(
            { success: false, message: "Error en la API de géneros", detail: message },
            { status: 500 }
        );
    }
}