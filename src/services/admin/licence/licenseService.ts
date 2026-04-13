
import { DriverPendingResponse } from "@/modules/admin/licenses/types/dto/driverPendingResponse";
import { LicenseVerifyDTO } from "@/modules/admin/licenses/types/licenseVerify";
import { VoidResponse } from "@/shared/types/response";

export async function getDriversPending(skip:number, orderBy:string): Promise<DriverPendingResponse> {
  try {
    const res = await fetch(`/api/admin/drivers/pending?skip=${skip}&orderBy=${orderBy}`,{
      method: 'GET',
      credentials: 'include',
    })

    const response: DriverPendingResponse = await res.json()

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

export async function driverVerifyLicense(driverId:number, data: LicenseVerifyDTO): Promise<VoidResponse> {
  try {
    const res = await fetch(`/api/admin/drivers/${driverId}/verify`,{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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