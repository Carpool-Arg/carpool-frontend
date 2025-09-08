import { fetchWithRefresh } from "@/lib/http/authInterceptor";
import { TripFormData, TripRequest } from "@/schemas/trip/tripSchema";
import { VoidResponse } from "@/types/response/response";


export async function getTrips(data: TripRequest): Promise<VoidResponse> {
  try {
    const res = await fetch('/api/trip',{
      headers: { 'Content-Type': 'application/json' },
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

export async function newTrip(data: TripRequest): Promise<VoidResponse> {
  try {
    const res = await fetchWithRefresh('/api/trip',{
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