import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const token = body.token;
        if (!token) {
            return new NextResponse(
                JSON.stringify({ message: "Falta el parámetro 'token'" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            )
        }

        const response = await fetch(`${apiUrl}/password-change`,{
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })

        const data = await response.json();

        if(!response.ok || data.state !=='OK'){
            return NextResponse.json(
                {
                    success:false,
                    message: data.messages?.[0] || 'Error al cambiar la contraseña',
                },
                {status: response.status}
            )
        }

        return new NextResponse(JSON.stringify(data),{
            status: response.status,
            headers: {"Content-Type":"application/json"}
        })
    } catch (error: unknown) {
        let message = "Error desconocido";
        if (error instanceof Error) message = error.message;
        return new NextResponse(
        JSON.stringify({ message: "Error en la API de password change", detail: message }),
        {
            status: 500,
            headers: { "Content-Type": "application/json" },
        }
        );
    }
}