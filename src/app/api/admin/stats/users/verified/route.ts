import { VerifiedUserResponse } from "@/modules/admin/dashboard/types/dto/verifiedUsersResponse";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * 
 * 
 * Permite consultar la cantidad de viajes entre dos fechas (`fromDate` y `toDate`)
 * y agrupar los resultados por día, semana, mes o año según `groupBy`.
 * 
 * @param req {NextRequest} - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON del tipo VerifiedUserResponse.
 */
export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get('token')?.value;

    const res = await fetch(`${apiUrl}/admin/stats/users/verified`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const response: VerifiedUserResponse = await res.json();


    if (!res.ok || response.state === "ERROR") {
      const messages =
        response.messages?.length > 0
          ? response.messages
          : ["Error desconocido"];
      return NextResponse.json(
        { data: null, messages, state: "ERROR" },
        { status: res.ok ? 200 : res.status } 
      );
    }

    return NextResponse.json(response, { status: res.status });
  } catch (error: unknown) {
    // Manejo de errores inesperados
    const message = error instanceof Error ? error.message : "Error desconocido";
    const errorRes = NextResponse.json(
      { data: null, messages: [message], state: "ERROR" },
      { status: 500 }
    );
    return errorRes;
  }
}