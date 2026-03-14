import { DriverReviewResponseDTO } from "@/modules/review/types/dto/DriverReviewResponseDTO";
import { ReviewRequestDTO } from "@/modules/review/types/dto/ReviewRequestDTO";
import { ReviewResponseDTO } from "@/modules/review/types/dto/ReviewResponseDTO";
import { ReviewsFromMeDTO } from "@/modules/review/types/dto/ReviewsFromMeDTO";
import { ReviewsToMeDTO } from "@/modules/review/types/dto/ReviewsToMeDTO";
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


export async function getDriverReviews(driverId: number, skip:number, orderBy:string):Promise<DriverReviewResponseDTO>{
  try{
    const res = await fetchWithRefresh(`/api/review/driver?driverId=${driverId}&skip=${skip}&orderBy=${orderBy}`)
    const response: DriverReviewResponseDTO = await res.json();

    if(!res.ok){
      throw new Error(response.messages?.[0] || "Error desconocido");
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function getReviewsFromMe( 
  role:string,
  skip: number,
  orderBy: string,
  fromDate?: Date,
  toDate?: Date
  ):Promise<ReviewsFromMeDTO>{
  try{
    const params = new URLSearchParams();

    params.append("role", role);
    params.append("skip", skip.toString());
    params.append("orderBy", orderBy);

    if (fromDate) params.append("fromDate", fromDate.toISOString().split("T")[0]);
    if (toDate) params.append("toDate", toDate.toISOString().split("T")[0]);

    const res = await fetchWithRefresh(`/api/review/from-me?${params}`)

    const response: ReviewsFromMeDTO = await res.json();

    if(!res.ok){
      throw new Error(response.messages?.[0] || "Error desconocido");
    }

    return response;
  } catch (error: unknown) {
    let message = "Error desconocido";
    if (error instanceof Error) message = error.message;

    return { data: null, messages: [message], state: "ERROR" };
  }
}

export async function getReviewsToMe( 
  role:string,
  skip: number,
  orderBy: string,
  fromDate?: Date,
  toDate?: Date
  ):Promise<ReviewsToMeDTO>{
  try{
    const params = new URLSearchParams();

    params.append("role", role);
    params.append("skip", skip.toString());
    params.append("orderBy", orderBy);

    if (fromDate) params.append("fromDate", fromDate.toISOString().split("T")[0]);
    if (toDate) params.append("toDate", toDate.toISOString().split("T")[0]);

    const res = await fetchWithRefresh(`/api/review/to-me?${params}`)

    const response: ReviewsToMeDTO = await res.json();

    if(!res.ok){
      throw new Error(response.messages?.[0] || "Error desconocido");
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