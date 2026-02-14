import { ReviewRequestDTO } from "@/modules/review/types/dto/ReviewRequestDTO";
import { ReviewResponseDTO } from "@/modules/review/types/dto/ReviewResponseDTO";
import { fetchWithRefresh } from "@/shared/lib/http/authInterceptor";
import { BooleanResponse } from "@/shared/types/response";

export async function createReview(request: ReviewRequestDTO): Promise<ReviewResponseDTO>{
  try{
    const res = await fetchWithRefresh('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      credentials: 'include'
    })

    const response: ReviewResponseDTO = await res.json()

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



export async function canUserReview(tripId: string): Promise<BooleanResponse>{
  
  try{
    const res = await fetch(`/api/review/can-review/${tripId}`,{
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include'
    });
  
    if (!res.ok) throw new Error("Error al realizar la verificación");
  
    const response: BooleanResponse = await res.json();
    return response; 
  }catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}