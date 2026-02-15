import { DriverReviewResponseDTO } from "@/modules/review/types/dto/DriverReviewResponseDTO";
import { fetchWithRefresh } from "@/shared/lib/http/authInterceptor";


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