import { vehicleFormData } from "@/types/forms";
import { VehicleGetResponse, VehiclePostResponse } from "@/types/response/vehicle";

export async function myVehicles(): Promise<{
  success: boolean;
  data?: VehicleGetResponse;
  message?: string;
}> {
  try {
    const res = await fetch("/api/vehicle", {
      method: "GET",
      credentials: "include", // incluye las cookies (donde está el token)
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      throw new Error(errorMessage.message);
    }

    const response: VehicleGetResponse = await res.json();

    return { success: true, data: response };
  } catch (error: any) {
    return { success: false, message: error.message || "Network error" };
  }
}


export async function registerVehicle(data: vehicleFormData): Promise<{
    success:boolean;
    data?:VehiclePostResponse;
    message?: string}
> {
    try {
        const res = await fetch('/api/vehicle',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include', 
        })

        const responseBody = await res.json();

        if (!res.ok) {
          throw new Error(responseBody.message || 'Error desconocido');
        }

        return { success: true, data: responseBody };
    } catch (err: any) {
        return {success: false, message: err.message}
   }
} 