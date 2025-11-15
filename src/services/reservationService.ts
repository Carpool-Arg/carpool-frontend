import { fetchWithRefresh } from "@/lib/http/authInterceptor";
import { Reservation } from "@/types/reservation";
import { ReeservationRequestDTO } from "@/types/reservationRequestDTO";
import { ReservationUpdateRequestDTO } from "@/types/reservationUpdateRequestDTO";
import { ReservationResponse } from "@/types/response/reservationResponseDTO";
import { VoidResponse } from "@/types/response/response";


export async function newReservation(data: Reservation): Promise<VoidResponse> {
  try {
    const res = await fetchWithRefresh('/api/reservation',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })

    const response: VoidResponse = await res.json()

    if (!res.ok) {
      throw new Error(response.messages?.[0] || 'Error desconocido');
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function getReservations(data: ReeservationRequestDTO): Promise<ReservationResponse>{
  try{
    const params = new URLSearchParams();

    // Agrega solo los parámetros que tienen valor
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `/api/reservation/filter?${params.toString()}`;

    const res = await fetchWithRefresh(url, {
      credentials: 'include',
    });

    const response: ReservationResponse = await res.json();
    console.log(response)
    if (!res.ok) {
      throw new Error(response.messages?.[0] || 'Error desconocido');
    }

    return response;
  }catch(error: unknown){
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function updateReservation(reservationUpdateRequest: ReservationUpdateRequestDTO): Promise<VoidResponse>{
  try{
    const res = await fetchWithRefresh('/api/reservation',{
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationUpdateRequest),
      credentials: 'include'
    });

    const response: VoidResponse = await res.json()

    if (!res.ok) {
      throw new Error(response.messages?.[0] || 'Error desconocido');
    }

    return response;
  }catch(error: unknown){
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;
    return { data: null, messages: [message], state: "ERROR" };
  }
}