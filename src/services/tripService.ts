import { fetchWithRefresh } from "@/lib/http/authInterceptor";
import { VoidResponse } from "@/types/response/response";
import { Trip } from "@/types/trip";


export async function getTrips(data: Trip): Promise<VoidResponse> {
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

export async function newTrip(data: Trip): Promise<VoidResponse> {
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


export const validateTripDateTime = async(startDateTime: string) =>{
  try {
    const formattedDateTime =  `${startDateTime}:00`
    
    const res = await fetchWithRefresh(`/api/trip/check-trip-availability?startDateTime=${formattedDateTime}`,{
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