
import { PassengerStatResponse } from "@/modules/activity/types/dto/PassengerStatResponse";


export async function getTripsStats(
  fromDate: string, 
  toDate: string, 
  orderBy:string
): Promise<PassengerStatResponse> {
  try {
    const query = `?fromDate=${fromDate}&toDate=${toDate}&orderBy=${orderBy}`;

    const res = await fetch(`/api/stats/passenger/trips${query}`,{
      method: 'GET',
      credentials: 'include',
    })

    const response: PassengerStatResponse = await res.json()

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
