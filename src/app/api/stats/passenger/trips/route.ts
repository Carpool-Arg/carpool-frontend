import { PassengerStatResponse } from "@/modules/activity/types/dto/PassengerStatResponse";
import { DriverPendingResponse } from "@/modules/admin/licenses/types/dto/driverPendingResponse";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Recupera las estadisticas.
 * 
 * 
 * 
 * @param req {NextRequest} - Objeto de la petición entrante de Next.js
 * @returns {Promise<NextResponse>} - Respuesta JSON del tipo PassengerStatResponse.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const token = req.cookies.get('token')?.value;
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const orderBy = searchParams.get("orderBy");

    const query = `?fromDate=${fromDate}&toDate=${toDate}&orderBy=${orderBy}`;

    const res = await fetch(`${apiUrl}/passenger/stats/trips${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const response: PassengerStatResponse = await res.json();

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