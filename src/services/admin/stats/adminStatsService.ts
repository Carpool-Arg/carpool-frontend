import { DriversPercentageResponse } from "@/modules/admin/dashboard/types/dto/driversPercentageResponse";
import { TopCityStatResponse } from "@/modules/admin/dashboard/types/dto/topCityStatResponse";

/**
 * -------------------------------------------------------------------------
 * CATEGORIA VIAJES
 * -------------------------------------------------------------------------
 */
export async function getTopOriginCities(): Promise<TopCityStatResponse> {
  try {

    const res = await fetch(`/api/admin/stats/top/origin`,{
      method: 'GET',
      credentials: 'include',
    })

    const response: TopCityStatResponse = await res.json()

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

export async function getTopDestinationCities(): Promise<TopCityStatResponse> {
  try {

    const res = await fetch(`/api/admin/stats/top/destination`,{
      method: 'GET',
      credentials: 'include',
    })

    
    const response: TopCityStatResponse = await res.json()
    console.log(response)
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

/**
 * -------------------------------------------------------------------------
 * CATEGORIA USUARIOS
 * -------------------------------------------------------------------------
 */

export async function getDriversPercentage(
  fromDate: string, 
  toDate: string, 
): Promise<DriversPercentageResponse> {
  try {
    const query = `?fromDate=${fromDate}&toDate=${toDate}`;

    const res = await fetch(`/api/admin/stats/drivers-percentage${query}`,{
      method: 'GET',
      credentials: 'include',
    })

    const response: DriversPercentageResponse = await res.json()
    console.log(response)
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
