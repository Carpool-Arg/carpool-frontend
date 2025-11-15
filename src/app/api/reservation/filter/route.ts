import { ReservationResponse } from "@/types/response/reservationResponseDTO";
import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const idTrip = searchParams.get("idTrip");
    const idStartCity = searchParams.get("idStartCity");
    const idDestinationCity = searchParams.get("idDestinationCity");
    const baggage = searchParams.get("baggage");
    const nameState = searchParams.get("nameState");
    // &nameState=${nameState}
   
    const res = await fetch(`${apiUrl}/reservation/filter?idTrip=${idTrip}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const response: ReservationResponse = await res.json();

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

    return NextResponse.json(response,{ status: res.status });
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